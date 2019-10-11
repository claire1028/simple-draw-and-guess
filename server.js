const express = require('express');
const Ws = require('ws');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  res.send('xxx');
});

const wss = new Ws.Server({port: 8080});
wss.on('connection', ws => {
  console.log('server connection');
  ws.on('message', msg => {
    console.log('server recived: %s', msg);
  });
  ws.send('hello, this is from server!');
});

app.listen(3000);