const cards = require('./public/cards.json');
const randomBetween = require('./functions/randombetween');
const minimumPlayers = 3;

function drawCard(black = false) {
  let color = black !== true ? 'whiteCards' : 'blackCards';
  return randomBetween(0, cards[color].length - 1);
}

function drawHand() {
  var output = [];
  for (var i = 0; i < 10; i++) {
    output.push(drawCard(false));
  }
  return output;
}

class GameRunner {
  constructor(room) {
    this.disconnected = this.disconnected.bind(this);
    this.connected = this.connected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.start = this.start.bind(this);
    this.drawAll = this.drawAll.bind(this);
    this.round = this.round.bind(this);
    this.winner = this.winner.bind(this);
    this.chooseCard = this.chooseCard.bind(this);
    this.roundTimeout = this.roundTimeout.bind(this);
    this.chooseWinner = this.chooseWinner.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.won = this.won.bind(this);
    this.roundTimeLimit = 30000;
    this.round2TimeLimit = 30000;
    this.checkStart = this.checkStart.bind(this);
    this.started = false;
    this.room = room;
    this.blackCard = drawCard(true);
    this.emit = this.room.emit;
    this.winAmount = 12;
    this.hands = {};
    this.stage = 1;
    this.wins = {};
    this.selections = {};
    this.roundNumber = 0;
  }
  round() {
    this.stage = 1;
    this.roundNumber++;
    this.roundWon = false;
    let playerIDs = Object.keys(this.room.players);
    if (playerIDs.length < 1) return this.room.destroy(false,'missing players in round check');
    console.log(playerIDs,this.roundNumber, (this.roundNumber - 1) % playerIDs.length);
    this.cardCzar = this.room.players[playerIDs[(this.roundNumber - 1) % playerIDs.length]];
    this.selections = {};
    this.blackCard = drawCard(true);
    this.emit('newround', {
      round: this.roundNumber,
      blackCard: this.blackCard,
      czar: this.cardCzar.user.username
    });
    this.drawAll();
  }
  drawAll() {
    Object.entries(this.hands).forEach(handPair => {
      if (!this.room.players[handPair[0]]) return;
      let socket = this.room.players[handPair[0]];
      if (socket === this.cardCzar) return;
      let hand = handPair[1];
      let card = drawCard(false);
      hand.push(card);
      socket.emit('drewcard', card);
    });
  }
  nextRound() {
    clearInterval(this.interval);
    this.interval = setInterval(this.roundTimeout, this.roundTimeLimit);
    this.round();
  }
  disconnected(socket) {
    console.log('removing',socket.user.username);
    socket.removeListener('choosecard',this.chooseCard);
    socket.removeListener('choosewinner',this.chooseWinner);
    if (Object.keys(this.room.players).length < minimumPlayers) this.room.destroy(false,'not enough players');
  }
  stage2() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = setInterval(this.nextRound,this.round2TimeLimit);
    }
    this.stage = 2;
    Object.keys(this.hands).forEach(handID=>{
      let hand = this.hands[handID];
      let selected = this.selections[handID];
      if (selected) {
        let cardIndex = hand.indexOf(selected);
        if (cardIndex > -1) hand.splice(cardIndex,1);
      }
    })
    this.emit('stage2', Object.values(this.selections));
  }
  chooseCard(socket,cardID) {
    if (typeof cardID != 'number' || this.stage != 1 || socket === this.cardCzar) return;
    let hand = this.hands[socket.id];
    if (!hand) return this.room.destroy(false,'missing hand!');
    let index = hand.indexOf(cardID);
    console.log('ci',index);
    if (index > -1) {
      this.selections[socket.id] = cardID;
      console.log('r2c',Object.keys(this.selections).length ,Object.keys(this.room.players).length - 1);
      if (Object.keys(this.selections).length >= Object.keys(this.room.players).length - 1) this.stage2();
    }
  }
  connected(socket) {
    this.checkStart();
    socket.on('choosecard', this.chooseCard.bind(this,socket));
    socket.on('choosewinner', this.chooseWinner.bind(this,socket));
  }
  chooseWinner(socket,index) {
    if (typeof index == 'number' && this.roundWon !== true && this.stage == 2 && this.cardCzar === socket) {
      this.roundWon = true;
      if (!this.winner(index)) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(this.nextRound,2000);
      }
    }
  }
  winner(index) {
    let userID = Object.keys(this.selections)[index];
    if (!userID) return false;
    let user = this.room.players[userID];
    if (!user) return false;
    let id = user.id;
    this.emit('roundwinner', {
      user: {username:user.user.username,displayname:user.user.displayname},
      cardNumber: index
    });
    this.wins[id] = (this.wins[id] || 0) + 1;
    let won = this.wins[id] >= this.winAmount;
    if (won) this.won(id);
    return won;
  }
  won(id){
    console.log(id,Object.keys(this.room.players));
    let socket = this.room.players[id];
    this.emit('gamewon',{displayname:socket.user.displayname,username:socket.user.username});
    this.room.destroy(true,'game won');
  }
  checkStart() {
    if (!this.started) {
      if (Object.keys(this.room.players).length >= minimumPlayers) {
        setTimeout(this.start,1000);
      }
    }
  }
  roundTimeout() {
    this.emit('roundtimeout');
    this.round();
  }
  start() {
    this.started = true;
    this.emit('gamestarting');
    console.log('players:',Object.keys(this.room.players).length);
    Object.values(this.room.players).forEach(socket => {
      this.hands[socket.id] = drawHand();
      socket.emit('startinghand', this.hands[socket.id]);
    });
    this.nextRound();
  }
  destroy() {
    if (this.interval) this.interval = clearInterval(this.interval);
  }
}
module.exports = GameRunner;
