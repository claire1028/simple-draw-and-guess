const server = require('./server.js').server;
const Socket = require('socket.io');
const io = new Socket(server);

io.on('connection', function(socket){
  console.log('a user connected');
});