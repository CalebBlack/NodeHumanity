var io = null;
var gameList = {};
var currentGameNumber = 1;
var inGame = {};
class Room {
  constructor(owner){
    this.disconnected = this.disconnected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.emit = this.emit.bind(this);
    // END OF BINDINGS
    this.players = [];
    this.id = ++currentGameNumber;
    gameList[this.id] = this;
    this.roomName = 'game '+this.id;
    this.room = io.to('some room');
    this.addPlayer(owner);
  }
  emit(event,data){
    this.room.emit(event,data);
  }
  destroy(){
    let index = gameList.indexOf(this);
    if (index > -1) gameList.splice(index,1);
    this.getPlayers.forEach(socket=>{
      this.removePlayer(socket);
    });
  }
  disconnected(socket){
    this.emit('playerleft',socket.id);
  }
  addPlayer(socket){
    if (inGame[socket.id]) throw new Error('Cannot Add Player: Already in Game.');
    inGame[socket.id] = this.id;
    socket.join(this.roomName);
  }
  removePlayer(socket){
    inGame[socket.id] = null;
    socket.leave(this.roomName);
  }
  getPlayers(){
    return io.sockets.in(this.roomName);
  }
}
function connected(socket){
  socket.on('joinroom',data=>{
    console.log('joinroom data',data);
  });
  socket.on('createroom',data=>{
    console.log('createroom data',data);
  });
}
function disconnected(socket) {
  if (inGame[socket.id]) {
    gameList[inGame[socket.id]].disconnected(socket);
  }
}
function setup(server) {
  io = server;
}
module.exports = {setup,connected,disconnected};
