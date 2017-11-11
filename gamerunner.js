class GameRunner {
  constructor(room) {
    this.disconnected = this.disconnected.bind(this);
    this.connected = this.connected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.room = room;
  }
  disconnected(socket){

  }
  connected(socket) {

  }
  destroy(){

  }
}
module.exports = GameRunner;
