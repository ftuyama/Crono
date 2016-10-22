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
    if (req.session == null || req.session == undefined)
        return res.redirect('/calendarAuth');
    var accessToken = req.session.access_token;
    if (accessToken == null || accessToken == undefined)
        return res.redirect('/calendarAuth');
    user = req.session.passport.user;
    if (user == null || user == undefined)
        return res.redirect('/calendarAuth');
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    retrieveChatHistory();
    sendUserConnected();
    socket.on('disconnect', function() { sendUserDisconnected() });
    socket.on('chat message', function(msg) { sendChatMessage(msg) });
});

/*
  ===========================================================================
                    Chat Message
  ===========================================================================
*/

function sendChatMessage(msg) {
    try {
        var event_talk = getEventTalk(msg, timeStamp());
        console.log(user.displayName + ' sent: ' + msg);
        redis.set(event_talk.key, JSON.stringify(event_talk.value));
        io.emit('chat message', event_talk);
    } catch (err) {
        console.log('error: ' + err);
    }
}

function getEventTalk(msg, time_stamp) {
    return {
        'key': 'chat:talk:' + time_stamp,
        'value': { 'user': user.displayName, 'message': msg }
    };
}

/*
  ===========================================================================
                    User Connected
  ===========================================================================
*/

function sendUserConnected() {
    try {
        var event_connected = getEventConnected(timeStamp());
        console.log(event_connected)
        console.log(user.displayName + ' connected');
        redis.set(event_connected.key, JSON.stringify(event_connected.value));
        io.emit('user connected', event_connected);
    } catch (err) {
        console.log('error: ' + err);
    }
}

function getEventConnected(time_stamp) {
    return {
        'key': 'chat:connected:' + time_stamp,
        'value': { 'user': user.displayName }
    };
}


/*
  ===========================================================================
                    User Disconnected
  ===========================================================================
*/

function sendUserDisconnected() {
    try {
        var event_disconnected = getEventDisconnected(timeStamp());
        console.log(user.displayName + ' disconnected');
        redis.set(event_disconnected.key, JSON.stringify(event_disconnected.value));
        io.emit('user disconnected', event_disconnected);
    } catch (err) {
        console.log('error: ' + err);
    }
}

function getEventDisconnected(time_stamp) {
    return {
        'key': 'chat:disconnected:' + time_stamp,
        'value': { 'user': user.displayName }
    };
}

/*
  ===========================================================================
                    Chat History
  ===========================================================================
*/

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

/*
  ===========================================================================
                    Auxilliary
  ===========================================================================
*/

function timeStamp() {
    return new Date().toISOString().replace(/\-|\T|\./g, ':');
}

module.exports = router;