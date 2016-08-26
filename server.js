// Importação dos modulos necessários.
var express = require('express');
var app = express();
var routes = require('./web/principal');
var users = require('./web/users');
var cookieParser = require('cookie-parser');

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/web/view'));
//Store all JS in Scripts folder.
app.use(express.static(__dirname + '/web/script'));
//Store all CSS in style folder.
app.use(express.static(__dirname + '/web/style'));
//Bower modules are used too.
app.use(express.static(__dirname + '/web/bower_components'));
//Store all cookies.
app.use(cookieParser())

app.use('/users', users);
app.use('/', routes);
console.log('bool')

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;