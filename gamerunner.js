class GameRunner {
  constructor(room) {
    this.disconnected = this.disconnected.bind(this);
    this.connected = this.connected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.tick = this.tick.bind(this);
    this.room = room;
    this.interval = setInterval(this.tick,1000);
  }
  tick(){
    console.log('tick');
  }
  disconnected(socket){
    
  }
  connected(socket) {

  }
  destroy(){
    clearInterval(this.interval);
    delete this.interval;
  }
}
module.exports = GameRunner;
