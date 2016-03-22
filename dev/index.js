var express = require('express');
var babelify = require('express-babelify-middleware');
var livereload = require('livereload');
var path = require('path');

var app = express();

app.use('/src', babelify(path.join(__dirname, '../src')));
app.use('/', express.static(__dirname + '/'));
app.use('/', express.static(path.join(__dirname, '../')));

app.listen(9000, function () {
  console.log('Started listening on port 9000!');
});

var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, '../src'));
liveReloadServer.watch(path.join(__dirname, './'));
