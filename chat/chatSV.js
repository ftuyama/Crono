/*
  ===========================================================================
            Chat Application written with Socket.io
  ===========================================================================
*/
// Importing packages
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

module.exports = router;