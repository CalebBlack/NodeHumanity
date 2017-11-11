const GameRunner = require('./gamerunner');
var io = null;
var gameList = {};
var inGame = {};
function getGameID(){
  let id = 1;
  while (gameList.hasOwnProperty(id)) {
    id++;
  }
  return id;
}
class Room {
  constructor(owner){
    this.disconnected = this.disconnected.bind(this);
    this.destroy = this.destroy.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    //this.getPlayers = this.getPlayers.bind(this);
    this.emit = this.emit.bind(this);
    // END OF BINDINGS
    this.players = [];
    this.id = getGameID();
    gameList[this.id] = this;
    this.roomName = 'game '+this.id;
    this.room = io.to('some room');
    this.addPlayer(owner);
    this.runner = new GameRunner(this);
  }
  emit(event,data){
    this.room.emit(event,data);
  }
  destroy(){
    delete gameList[this.id];
    this.players.forEach(socket=>{
      this.removePlayer(socket);
    });
    this.runner.destroy();
  }
  disconnected(socket){
    this.emit('playerleft',socket.id);
    this.removePlayer(socket);
  }
  addPlayer(socket){
    if (inGame[socket.id]) throw new Error('Cannot Add Player: Already in Game.');
    let self = this;
    inGame[socket.id] = this.id;
    socket.join(this.roomName);
    socket.on('disconnect',()=>{self.removePlayer(socket)});
    this.players.push(socket);
    this.emit('playerjoin',socket.id);
    this.runner.connected(socket);
  }
  removePlayer(socket){
    let index = this.players.indexOf(socket);
    if (index > -1) this.players.splice(index,1);
    delete inGame[socket.id];
    socket.leave(this.roomName);
    if (this.players.length < 1) this.destroy();
    this.runner.disconnected(socket);
  }
  // getPlayers(){
  //   console.log('p',io.sockets.in(this.roomName));
  //   return io.sockets.in(this.roomName);
  // }
}
function connected(socket){
  socket.on('joinroom',data=>{
    if (typeof data == 'number' && !inGame.hasOwnProperty(socket.id) && gameList[data]) {
      gameList[data].addPlayer(socket);
    } else {
      socket.emit('joinroomfailed');
    }
  });
  socket.on('leaveroom',data=>{
    if (inGame.hasOwnProperty(socket.id)) {
      gameList[inGame[socket.id]].removePlayer(socket);
      socket.emit('leftroom');
    } else {
      socket.emit('leaveroomfailed');
    }
  });
  socket.on('createroom',data=>{
    if (!inGame[socket.id]) {
      let room = new Room(socket);
      socket.emit('roomcreated',room.id);
    } else {
      socket.emit('roomcreationfailed');
    }
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
