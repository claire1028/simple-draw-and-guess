const server = require('./server.js').server;
const Socket = require('socket.io');
const io = new Socket(server);

const channelNamesMap = {};
const socketIdNameMap = {};
const goods = ['book', 'pen', 'flower', 'cloud', 'leaf', 'bird'];
let CURR_GOODS = '';

function checkNameExist(arr, item) {
  return arr.findIndex(v => v === item) > -1;
}

function removeNameFromList(arr, item) {
  const i = arr.findIndex(v => v === item);
  return i > -1 ? arr.splice(i, 1) : arr;
}

const getRandomGoods = () => {
  const i = Math.floor(Math.random() * 6);
  return CURR_GOODS = goods[i];
};

const getRandomMaster = (arr, totalNum) => {
  console.log('999', totalNum);
  if(totalNum === 1) {
    return arr[0];
  }
  const i = Math.floor(Math.random() * totalNum);
  return arr[i];
};

io.on('connection', (socket) => {

  socket.on('join room', (data) => {
    let dns = io.of('/' + data.id);
    let cn = channelNamesMap[data.id];
    if(!cn) {
      cn = [];
    }
    let master = '';

    const changeMaster = () => {
      master = getRandomMaster(cn, cn.length);
      dns.emit('master', master);
      dns.to(socketIdNameMap[master]).emit('goods', getRandomGoods());
    };

    dns.on('connection', (csoc) => {

      csoc.on('new name', (msg) => {
        if(checkNameExist(cn, msg.name)) {
          csoc.emit('tip', 'name already exits! pls enter another');
        } else {
          csoc.emit('tip', 'success');
          cn.push(msg.name);
          socketIdNameMap[msg.name] = csoc.id;

          if(!master) {
            changeMaster();
          }
          dns.emit('message', {type: 'desc', msg: msg.name + ' joined the room!'});
          dns.emit('channel names', cn);    
        }
      });

      csoc.on('new message', data => {
        dns.emit('message', {type: 'own', ...data});
        if(data.msg.indexOf(CURR_GOODS) > -1) {
          dns.emit('message', {type: 'result', ...data});
          changeMaster();
        }
      });

      csoc.on('remove user', data => {
        removeNameFromList(cn, data.name);
        dns.emit('channel names', cn); 
        dns.emit('message', {type: 'desc', msg: data.name + ' leaved the room!'});
        if(master === data.name) {
          changeMaster();
        }
      });

      csoc.on('image data', data => {
        dns.emit('image', data);
      })
    });

  })
})

