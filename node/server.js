const app = require('express')();
const server = require('http').createServer(app);

module.exports = {
  server,
  app
};