const {Session} = require('./models');
var socketList = [];

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
  var i = socketList.indexOf(socket);
  while (i > -1) {
    socketList.splice(i,1);
    i = socketList.indexOf(socket);
  }
}
function authorized(socket,token){
  if (!socketList.includes(socket)) socketList.push(socket);
  setTimeout(()=>{
    socket.disconnect('Session Timed Out')
  },1000 * 60 * 60 * 6);
  socket.on('disconnect',()=>{disconnected(socket)});
  // END OF CONNECTION HANDLING

  console.log('authorized');
}
module.exports = sockets;
