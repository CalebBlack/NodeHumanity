class GameRunner {
  constructor(room) {
    this.disconnected = this.disconnected.bind(this);
    this.connected = this.connected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.start = this.start.bind(this);
    this.tick = this.tick.bind(this);
    this.checkStart = this.checkStart.bind(this);
    this.started = false;
    this.room = room;
    this.emit = this.room.emit;
  }
  tick(){

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
    this.interval = setInterval(this.tick,1000);
    this.cardCzarOrder = this.room.players
  }
  destroy(){
    if (this.interval) this.interval = clearInterval(this.interval);
  }
}
module.exports = GameRunner;
