const {
  Session
} = require('./models');

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
function authorized(socket,token){
  setTimeout(()=>{
    socket.disconnect('Session Timed out')
  },1000 * 60 * 60 * 12);
  console.log('authorized');
}
module.exports = sockets;
