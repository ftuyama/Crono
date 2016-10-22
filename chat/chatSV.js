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
var config = require('../config');
var user;

router.get('/', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    user = req.session.passport.user;
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    retrieveChatHistory();

    try {
        console.log(user.displayName + ' connected');
        redis.set("chat:connected: " + timeStamp(), user.displayName);
        io.emit('user connected', user.displayName);
    } catch (err) {
        console.log('chat error ' + err);

    }
    socket.on('disconnect', function() {
        try {
            console.log(user.displayName + 'disconnected');
            redis.set("chat:disconnected: " + timeStamp(), user.displayName);
            io.emit('user disconnected', user.displayName);
        } catch (err) {
            console.log('chat error ' + err);

        }
    });
    socket.on('chat message', function(msg) {
        try {
            io.emit('chat message', msg);
            console.log(user.displayName + ' sent: ' + msg);
            redis.set("chat:talk:" + timeStamp(), JSON.stringify({
                'user': user.displayName,
                'message': msg
            }));

        } catch (err) {
            console.log('error: ' + err);
        }
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