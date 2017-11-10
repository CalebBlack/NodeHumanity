const {Session} = require('./models');
var socketList = [];
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
        if (err || !token) return next(new Error('Unauthorized'));
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
}
function disconnected(socket){
  GameManager.disconnected(socket);
}
function authorized(socket,token){
  setTimeout(()=>{
    socket.disconnect('Session Timed Out')
  },1000 * 60 * 60 * 6);
  socket.on('disconnect',()=>{disconnected(socket)});
  GameManager.connected(socket);
  // END OF CONNECTION HANDLING

  console.log('authorized');
}
module.exports = sockets;
