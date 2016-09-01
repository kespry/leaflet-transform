var express = require('express');
var babelify = require('express-babelify-middleware');
var path = require('path');

var app = express();

app.use('/src', babelify(path.join(__dirname, '../src')));
app.use('/', express.static(__dirname + '/'));
app.use('/', express.static(path.join(__dirname, '../')));

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Started listening on port', port);
});
