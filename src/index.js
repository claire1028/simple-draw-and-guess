const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('ws open');
  ws.send('this is from client');
};

ws.onmessage = (e) => {
  console.log('ws onmessage');
  console.log('client received: %s', e.data);
}