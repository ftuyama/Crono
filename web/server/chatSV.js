/*
  ===========================================================================
            Chat Application written with Socket.io
  ===========================================================================
*/
// Importing packages
var app = require('express')();
var express = require('express');
var router = express.Router();
var fs = require('fs');
// Setting socket.io application
var appl = require("../../server");
var server = appl.server;
var redis = appl.redis;
var io = require('socket.io')(server, { path: '/chat-socket' });
var config = require("../../config/config");
var cacheLimit = 1000;
var user;

/*
  ===========================================================================
                    Definindo Sessão e Conexão básica
  ===========================================================================
*/

router.get('/', function(req, res) {
    req.session.origin = 'chat';
    if (req.session == null || req.session == undefined ||
        req.session.access_token == null || req.session.access_token == undefined)
        return res.redirect('/calendarAuth');
    user = req.session.passport.user;
    res.send(fs.readFileSync("web/view/chat.html", "utf8"));
});

io.on('connection', function(socket) {
    socket.handshake.session = user;
    if (user != undefined) {
        retrieveChatHistory(user);
        sendEvent('connected', '', user);
    }
    socket.on('disconnect', function() { sendEvent('disconnected', '', socket.handshake.session) });
    socket.on('chat message', function(msg) { sendEvent('chat', msg, socket.handshake.session) });
    socket.on('spam', function(msg) { sendSpam(msg) });
});

/*
  ===========================================================================
                    Fire Chat Messages - Redis / View
  ===========================================================================
*/

function sendEvent(kind, msg, user) {
    if (user == undefined) return;
    try {
        if (avoidCacheLimit(msg)) return;
        var event = getEvent(kind, msg, user, timeStamp());
        console.log(user.displayName + ' ' + kind + ': ' + msg);
        if (!debug(kind))
            redis.set(event.key, JSON.stringify(event.value));
        io.emit(kind, event);
    } catch (err) {
        console.log('error: ' + err);
    }
}

function getEvent(kind, msg, user, time_stamp) {
    return {
        'key': 'chat:' + kind + ':' + time_stamp,
        'value': {
            'user': user.displayName,
            'message': msg,
            'img': retrieveImageUrl(user)
        }
    };
}

/* Evita ataque hackers. Xupa Ilharco ;) */
function avoidCacheLimit(msg) {
    if (msg && msg.length > 200) return true;
    redis.keys('*', function(err, keys) {
        var transbordo = keys.length - cacheLimit;
        if (transbordo > 0) {
            keys = dancaDoCrioulo(keys);
            for (var i = 0; i < transbordo; i++)
                redis.del(keys[i]);
        }
    });
    return false;
}

function retrieveChatHistory(user) {
    avoidCacheLimit();
    redis.keys('chat:*', function(err, keys) {
        io.emit('keys', keys.length);
        keys = dancaDoCrioulo(keys);
        keys.forEach(function(key) {
            redis.get(key, function(err, value) {
                if (user != undefined) {
                    io.emit('history', {
                        'dest': user.displayName,
                        'msg': { key, value }
                    });
                }
            });
        });
    });
}

function sendSpam(msg) {
    io.emit('spam', {
        'key': 'chat:spam:' + timeStamp(),
        'value': { 'user': 'Anon', 'message': msg }
    });
}

/*
  ===========================================================================
                    Auxialliary Functions - Code Smell
  ===========================================================================
*/

function dancaDoCrioulo(keys) {
    keys = jogaParaTras(keys);
    keys = keys.sort();
    keys = jogaParaFrente(keys);
    return keys;
}

function jogaParaTras(keys) {
    new_keys = [];
    keys.forEach(function(key) {
        new_keys.push(
            key.split(':').slice(2).join(':') + ':' +
            key.split(':').slice(0, 2).join(':')
        );
    });
    return new_keys;
}

function jogaParaFrente(keys) {
    new_keys = [];
    keys.forEach(function(key) {
        new_keys.push(
            key.split(':').slice(7).join(':') + ':' +
            key.split(':').slice(0, 7).join(':')
        );
    });
    return new_keys;
}

/*
  ===========================================================================
                    Auxialliary Functions - Small funcs
  ===========================================================================
*/

function retrieveImageUrl(profile) {
    if (typeof profile._json['picture'] != "undefined")
        return profile._json['picture'];
    return profile._json.image['url'];
}

function timeStamp() {
    return new Date().toISOString().replace(/\-|\T|\./g, ':');
}

/* Não emite evento em localhost */
function debug(kind) {
    return config.web.port == 8080 &&
        (kind == "connected" || kind == "disconnected")
}

module.exports = router;