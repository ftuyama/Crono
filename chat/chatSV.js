/*
  ===========================================================================
            Chat Application written with Socket.io
  ===========================================================================
*/
// Importing packages
var app = require('express')();
var express = require('express');
var router = express.Router();
// Setting socket.io application
var server = require("../server").server;
var io = require('socket.io')(server, { path: '/chatS' });

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
        console.log('user sent' + msg);
    });
});

module.exports = router;