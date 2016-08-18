// Importação dos modulos necessários.
process.title = 'App Server RAMBook';
var config = require('./config');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);

// Configuração do socket.io
var io = require('socket.io')(http, {
    origins: config.socketio.origins,
    transports: config.socketio.transports
});

// Configuração do express.
//CORS
var allowCors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.express.origins);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
    next();
};
app.use(allowCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// Diz ao Express que o diretório web contém conteúdos estáticos
app.use(express.static(__dirname + '/web'));

// Exporta os módulos
module.exports.socketIO = io;
module.exports.http = http;
