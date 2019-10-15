const server = require('./server.js').server;
const Socket = require('socket.io');
const io = new Socket(server);

const channelNamesMap = {};

function checkNameExist(arr, item) {
  return arr.find(v => v === item) > -1;
}

io.on('connection', (socket) => {

  socket.on('join room', (data) => {
    let dns = io.of('/' + data.id);
    let cn = channelNamesMap[data.id];
    if(!cn) {
      cn = [];
    }

    dns.on('connection', (csoc) => {

      csoc.on('new name', (msg) => {
        if(checkNameExist(cn, msg.name)) {
          csoc.emit('tip', 'name already exits! pls enter another');
        } else {
          csoc.emit('tip', 'success');
          cn.push(msg.name);
          dns.emit('message', {type: 'desc', msg: msg.name + 'has joined the room!'});
          dns.emit('channel names', cn);    
        }
      });

      csoc.on('new message', data => {
        dns.emit('message', {type: 'own', ...data});
      });

    });

  })
})

