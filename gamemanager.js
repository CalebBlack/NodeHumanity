const GameRunner = require('./gamerunner');
const filterChat = require('./filterchat');
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
function getNames(socket){
  return {username:socket.user.username,displayname:socket.user.displayname};
}
function getRoomList(resultCount=100){
  let keys = Object.keys(gameList);
  var output = [];
  for (var i = keys.length - 1; i > -1 && output.length < resultCount; i--) {
    let game = gameList[keys[i]];
    if (game.runner.started === false) {
      output.push({id:game.id,players:Object.keys(game.players).length});
    }
  }
  return output;
  // return keys.slice(Math.max(0,keys.length - resultCount),resultCount).map(gameNumber=>{
  //   let game = gameList[gameNumber];
  //   return {id:gameNumber,players:game.players.length}
  // });
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
    this.players = {};
    this.id = getGameID();
    gameList[this.id] = this;
    this.roomName = 'game '+this.id;
    this.room = io.to('some room');
    this.runner = new GameRunner(this);
    this.addPlayer(owner);
  }
  emit(event,data){
    this.room.emit(event,data);
  }
  destroy(safe=false){
    if (safe !== true) this.emit('gamedestroyed');
    this.emit('gameended');
    delete gameList[this.id];
    Object.keys(this.players).forEach(socketID=>{
      this.removePlayer(socketID);
    });
    this.runner.destroy();
  }
  disconnected(socket){
    this.removePlayer(socket.id);
  }
  addPlayer(socket){
    if (inGame[socket.id]) throw new Error('Cannot Add Player: Already in Game.');
    let self = this;
    inGame[socket.id] = this.id;
    socket.join(this.roomName);
    //console.log('add plahyer');
    socket.on('disconnect',()=>{self.disconnected(socket)});
    this.players[socket.id] = socket;
    this.emit('playerjoin',getNames(socket));
    this.runner.connected(socket);
  }
  removePlayer(socketID){
    let socket = this.players[socketID];
    if (!socket) return;
    delete this.players[socket.id];
    delete inGame[socket.id];
    socket.leave(this.roomName);
    if (Object.keys(this.players).length < 1) this.destroy();
    this.emit('playerleft',getNames(socket));
    this.runner.disconnected(socket);
  }
  // getPlayers(){
  //   console.log('p',io.sockets.in(this.roomName));
  //   return io.sockets.in(this.roomName);
  // }
}
function playerList(roomID) {
  return Object.values(gameList[roomID].players).map(socket=>{return getNames(socket)});
}
function connected(socket){
  socket.on('joinroom',data=>{

    if (typeof data == 'number' && isFinite(data) && !isNaN(data)) {
      data = data.toString();
    }
    if (typeof data == 'string' && !inGame[socket.id] && gameList[data] && gameList[data].runner.started === false) {
      gameList[data].addPlayer(socket);
      socket.emit('roomjoined',data);
    } else {
      socket.emit('joinroomfailed');
    }
  });
  socket.on('getplayers',()=>{
    if (inGame[socket.id]) {
      socket.emit('playerlist',playerList(inGame[socket.id]));
    }
  })
  socket.on('leaveroom',data=>{
    if (inGame[socket.id]&& gameList[inGame[socket.id]]) {
      gameList[inGame[socket.id]].removePlayer(socket.id);
      socket.emit('leftroom');
    } else {
      socket.emit('leaveroomfailed');
    }
  });
  socket.on('sendchat',message=>{
    message = message.trim();
    if (typeof message == 'string' && message.length > 0 && filterChat(message) === false) {
      if (inGame[socket.id]) {
        let game = gameList[inGame[socket.id]];
        if (game) {
          game.emit('chatmessage',{sender:socket.user.username,message});
        }
      }
    }
  })
  socket.on('createroom',data=>{
    if (!inGame[socket.id]) {
      let room = new Room(socket);
      socket.emit('roomcreated',room.id);
    } else {
      socket.emit('roomcreationfailed');
    }
  });
  socket.on('listrooms',data=>{
    socket.emit('roomlist',getRoomList());
  });
}
function disconnected(socket) {
  if (inGame[socket.id]) {
    let game = gameList[inGame[socket.id]];
    if (game) {
      game.disconnected(socket);
    }
  }
}
function setup(server) {
  io = server;
}
module.exports = {setup,connected,disconnected};
