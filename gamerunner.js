const cards = require('./public/cards.json');
const randomBetween = require('./functions/randombetween');
const minimumPlayers = 2;

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
    this.won = this.won.bind(this);
    this.roundTimeLimit = 10000;
    this.checkStart = this.checkStart.bind(this);
    this.started = false;
    this.room = room;
    this.blackCard = drawCard(true);
    this.emit = this.room.emit;
    this.winAmount = 3;
    this.hands = {};
    this.stage = 1;
    this.wins = {};
    this.selections = {};
    this.roundNumber = 0;
  }
  round() {
    this.stage = 1;
    this.roundNumber++;
    let playerIDs = Object.keys(this.room.players);
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
  }
  stage2() {
    this.stage = 2;
    this.emit('stage2', Object.values(this.selections));
  }
  chooseCard(socket,id) {
    console.log(socket.user.username,'choosing',id);
    if (typeof id != 'number' || this.stage != 1 || socket === this.cardCzar) return;
    let hand = this.hands[socket.id];
    if (hand[id]) {
      this.selections[socket.id] = hand[id];
      console.log(Object.keys(this.selections).length ,Object.keys(this.room.players).length - 1);
      if (Object.keys(this.selections).length >= Object.keys(this.room.players).length - 1) this.stage2();
    } else {
      console.log('ni',hand,id);
    }
  }
  connected(socket) {
    this.checkStart();
    socket.on('choosecard', this.chooseCard.bind(this,socket));
    socket.on('choosewinner', this.chooseWinner.bind(this,socket));
  }
  chooseWinner(socket,index) {
    if (typeof index == 'number' && this.stage == 2 && this.cardCzar === socket) {
      if (!this.winner(index)) {
        this.nextRound();
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
      user: user.user.username
    });
    this.wins[id] = (this.wins[id] || 0) + 1;
    let won = this.wins[id] >= this.winAmount;
    if (won) this.won(id);
    return won;
  }
  won(id){
    this.emit('gamewon',{user:this.room.players[id].username});
    this.room.destroy();
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
