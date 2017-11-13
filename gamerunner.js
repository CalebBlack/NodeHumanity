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
    this.roundTimeLimit = 10000;
    this.checkStart = this.checkStart.bind(this);
    this.started = false;
    this.room = room;
    this.emit = this.room.emit;
    this.hands = {};
    this.selections = {};
  }
  round(){
    this.selections = {};
    this.emit('newround',drawCard(true));
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
    this.interval = setInterval(this.round,this.roundTimeLimit);
    this.round();
  }
  disconnected(socket){

  }
  connected(socket) {
    this.checkStart();
    socket.on('choosecard',id=>{
      if (typeof id != 'number') return;
      let hand = this.hands[socket.id];
      if (hand.includes(id)) {
        this.selections[socket.id] = id;
      }
    });
    socket.on('choosewinner',id=>{
      if (typeof id == 'number' && this.room.players[id] && this.cardCzar === socket.id) {
        if (!this.winner(id)) {
          this.nextRound();
        }
      }
    })
  }
  winner(id){

  }
  checkStart(){
    if (!this.started) {
      if (Object.keys(this.room.players).length >= minimumPlayers) {
        this.start();
      }
    }
  }
  start(){
    this.started = true;
    this.emit('gamestarting',drawCard(true));
    this.interval = setInterval(this.round,this.roundTimeLimit);
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
