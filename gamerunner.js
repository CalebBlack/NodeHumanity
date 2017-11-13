const cards = require('./public/cards.json');
const randomBetween = require('./functions/randombetween');
const minimumPlayers = 1;

function drawCard(black=false){
  let color = black !== true ? 'whiteCards' : 'blackCards';
  return randomBetween(0,cards[color].length -1);
}
function drawHand(){
  var output = [];
  for (var i = 0; i < 10; i++){
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
    this.roundTimeout = this.roundTimeout.bind(this);
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
    this.roundNumber = 1;
  }
  round(){
    this.stage = 1;
    this.roundNumber++;
    this.selections = {};
    this.blackCard = drawCard(true);
    this.emit('newround',{round:this.roundNumber,blackCard:this.blackCard});
    this.drawAll();
  }
  drawAll(){
    Object.entries(this.hands).forEach(handPair=>{
      let hand = handPair[1];
      let card = drawCard(false);
      hand.push(card);
      this.room.players[handPair[0]].emit('drewCard',card);
    });
  }
  nextRound(){
    clearInterval(this.interval);
    this.interval = setInterval(this.roundTimeout,this.roundTimeLimit);
    this.round();
  }
  disconnected(socket){

  }
  stage2(){
    this.stage = 2;
    this.emit('roundstage',this.stage);
  }
  connected(socket) {
    this.checkStart();
    socket.on('choosecard',id=>{
      if (typeof id != 'number' || this.stage != 1 || socket === this.cardCzar) return;
      let hand = this.hands[socket.id];
      if (hand.includes(id)) {
        this.selections[socket.id] = id;
      }
    });
    socket.on('choosewinner',id=>{
      if (typeof id == 'number' && this.stage == 2 && this.room.players[id] && this.cardCzar === socket.id) {
        if (!this.winner(id)) {
          this.nextRound();
        }
      }
    })
  }
  winner(id){
    this.emit('roundwinner',{user:this.room.sockets[id].user.username});
    this.wins[id] = (this.wins[id] || 0) + 1;
    return this.wins[id] >= this.winAmount;
  }
  checkStart(){
    if (!this.started) {
      if (Object.keys(this.room.players).length >= minimumPlayers) {
        this.start();
      }
    }
  }
  roundTimeout(){
    this.emit('roundtimeout');
    this.round();
  }
  start(){
    this.started = true;
    this.emit('gamestarting',{round:this.roundNumber,blackCard:drawCard(true)});
    this.interval = setInterval(this.roundTimeout,this.roundTimeLimit);
    Object.values(this.room.players).forEach(socket=>{
      this.hands[socket.id] = drawHand();
      socket.emit('startinghand',this.hands[socket.id]);
    });
  }
  destroy(){
    if (this.interval) this.interval = clearInterval(this.interval);
  }
}
module.exports = GameRunner;
