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
var appl = require("../server");
var server = appl.server;
var redis = appl.redis;
var io = require('socket.io')(server, { path: '/chatS' });

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    retrieveChatHistory();
    console.log('a user connected');
    redis.set("chat:connected:" + timeStamp(), 'user');
    socket.on('disconnect', function() {
        console.log('user disconnected');
        redis.set("chat:disconnected:" + timeStamp(), 'user');
    });
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
        console.log('user sent' + msg);
        redis.set("chat:talk:" + timeStamp(), JSON.stringify({
            'user': 'user',
            'message': msg
        }));
    });
});

function retrieveChatHistory() {
    redis.keys('chat:talk:*', function(err, keys) {
        keys.sort();
        keys.forEach(function(key) {
            redis.get(key, function(err, value) {
                io.emit('history', { key, value });
            });
        });
    });
}

function timeStamp() {
    return new Date().toISOString().replace(/\-|\T|\./g, ':');
}

module.exports = router;