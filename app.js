const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const chokidar = require('chokidar');
let router = require('./node/router.js');
const {server, app} = require('./node/server.js');
require('./node/socket.js');

const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.use((req,res, next) => {
  router(req,res,next);
});

server.listen(3000, () => {
  console.log('listening on 3000');
}) ;

chokidar.watch('./node').on('change', () => {
  Object.keys(require.cache).forEach(function(cachePath) {
    if (/[\/\\]node[\/\\]/.test(cachePath)) {
      delete require.cache[cachePath];
    } ;
  });
  router = require('./node/router.js');
});