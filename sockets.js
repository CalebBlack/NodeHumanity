const {Session} = require('./models');

function sockets(app){
  let server = require('http').createServer(app);
  let io = require('socket.io')(server);

  io.use(function(socket, next) {
  var token = socket.request.query.token;
  if (token) {
    Session.findOne({_id:token},(err,token)=>{
      if (err || !token) return next(new Error('Unauthorized'));
      next();
    })
  } else {
    next(new Error('Unauthorized'));
  }
  });

  io.on('connection', function (socket) {
    console.log('new socket connection');
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
}
module.exports = sockets;
