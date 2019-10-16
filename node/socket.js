const server = require('./server.js').server;
const Socket = require('socket.io');
const io = new Socket(server);

const channelNamesMap = {};

function checkNameExist(arr, item) {
  return arr.findIndex(v => v === item) > -1;
}

function removeNameFromList(arr, item) {
  const i = arr.findIndex(v => v === item);
  return i > -1 ? arr.splice(i, 1) : arr;
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
          dns.emit('message', {type: 'desc', msg: msg.name + ' joined the room!'});
          dns.emit('channel names', cn);    
        }
      });

      csoc.on('new message', data => {
        dns.emit('message', {type: 'own', ...data});
      });

      csoc.on('remove user', data => {
        removeNameFromList(cn, data.name);
        dns.emit('channel names', cn); 
        dns.emit('message', {type: 'desc', msg: data.name + ' leaved this room!'});
      });

    });

  })
})

