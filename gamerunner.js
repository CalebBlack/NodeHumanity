const cards = require('./public/cards.json');
const randomBetween = require('./functions/randombetween');
function drawCard(black=false){
  let color = black !== true ? 'whiteCards' : 'blackCards';
  return cards[color][randomBetween(0,cards[color].length -1)];
}
function drawHand(){

}

class GameRunner {
  constructor(room) {
    this.disconnected = this.disconnected.bind(this);
    this.connected = this.connected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.start = this.start.bind(this);
    this.round = this.round.bind(this);
    this.checkStart = this.checkStart.bind(this);
    this.started = false;
    this.room = room;
    this.emit = this.room.emit;
    this.hands = {};
  }
  round(){

  }
  disconnected(socket){

  }
  connected(socket) {
    this.checkStart();
  }
  checkStart(){
    if (!this.started) {
      if (this.room.players.length > 2) {
        this.start();
      }
    }
  }
  start(){
    this.started = true;
    this.emit('gamestarting');
    this.interval = setInterval(this.round,1000);
  }
  destroy(){
    if (this.interval) this.interval = clearInterval(this.interval);
  }
}
module.exports = GameRunner;
