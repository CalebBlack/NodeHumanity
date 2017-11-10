const {
  Session
} = require('./models');

function sockets(server) {
  let io = require('socket.io')(server);

  io.on('connection', function(socket) {
    socket.auth = false;
    socket.on('authenticate', function(data) {
      let token = data.token;
      if (!token) return socket.disconnect('Unauthorized');
      Session.findOne({_id:token},(err,token)=>{
        if (err || !token) return next(new Error('Unauthorized'));
        socket.auth = true;
        authorized(socket,token);
      })
    });

    setTimeout(function() {
      //If the socket didn't authenticate, disconnect it
      if (!socket.auth) {
        //console.log("Disconnecting socket ", socket.id);
        socket.disconnect('Unauthorized');
      }
    }, 1000);
  });
}
function authorized(socket,token){
  console.log('authorized');
}
module.exports = sockets;
