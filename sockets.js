const {Session} = require('./models');
var socketList = [];
var connected = {};
const GameManager = require('./gamemanager');

function sockets(server) {
  let io = require('socket.io')(server);

  io.on('connection', function(socket) {
    socket.auth = false;
    socket.on('authenticate', function(data) {
      socket.removeAllListeners("authenticate");
      let token = data.token;
      if (!token) return socket.disconnect('Unauthorized');
      Session.findOne({_id:token},(err,token)=>{
        if (err || !token) return socket.disconnect('Unauthorized');
        console.log(connected,token._id,connected[token._id]);
        if (connected.hasOwnProperty(token._id)) return socket.disconnect('Already Connected');
        console.log('allowed');
        connected[token._id] = socket;
        socket.auth = true;
        authorized(socket,token);
      })
    });
    setTimeout(function() {
      if (!socket.auth) {
        socket.disconnect('Unauthorized');
      }
    }, 1000);
  });
  GameManager.setup(io);
}
function disconnected(socket){
  GameManager.disconnected(socket);
}
function authorized(socket,token){
  setTimeout(()=>{
    socket.disconnect('Session Timed Out')
  },1000 * 60 * 60 * 6);
  socket.on('disconnect',()=>{disconnected(socket);delete connected[token._id]});
  GameManager.connected(socket);
  // END OF CONNECTION HANDLING

  console.log('authorized');
}
function disconnect(id,reason='Disconnected'){
  if (connected[id]) {
    connected[id].disconnect(reason);
    delete connected[id];
  }
}
function getConnected(){
  return connected;
}
module.exports = {sockets,disconnect,getConnected};
