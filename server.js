// Importação dos modulos necessários.
var express = require('express');
var app = express();
var config = require('./config');

/* APIs */
var calendarAuth = require('./APICalendar/auth');
var firebaseAuth = require('./APIFirebase/auth');
var projectAuth = require('./APIGit/auth');
/* Pages */
var principal = require('./web/server/principalSV');
var index = require('./web/server/indexSV');
var users = require('./web/server/usersSV');
var calendar = require('./web/server/calendarSV');
var about = require('./web/server/aboutSV');
/* Services */
var chat = require('./chat/chatSV');
/* Tools */
var session = require('express-session');
var redisClient = require('redis').createClient({
    host: config.redis.host,
    port: config.redis.port
});
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var passport = require('passport');

/*
  ===========================================================================
            Setup filesystem and express for the application
  ===========================================================================
*/

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/web/view'));
//Store all JS in Scripts folder.
app.use(express.static(__dirname + '/web/server'));
app.use(express.static(__dirname + '/web/contrl'));
app.use(express.static(__dirname + '/web/script'));
//Store all CSS in style folder.
app.use(express.static(__dirname + '/web/style'));
//Store all public in web folder
app.use(express.static(__dirname + '/web/public'));
app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/chat'));

// Configure server
app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret: 'my easter egg',
    cookie: { maxAge: config.web.cookie_age },
    maxAge: config.web.cookie_age, // 1 hour
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
        client: redisClient,
        pass: config.redis.pass
    })
}))
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/calendarAuth', calendarAuth);
app.use('/projectAuth', projectAuth);
app.use('/firebase', firebaseAuth);
app.use('/calendar', calendar);
app.use('/users', users);
app.use('/main', principal);
app.use('/about', about);
app.use('/chat', chat);
app.use('/', index);

// Redis client
redisClient.on('connect', function() {
    console.log("Redis client connected at port %s", config.redis.port)
});

// Server
var server = app.listen(config.web.port, function() {
    var port = server.address().port
    console.log("Crono app listening at port %s", port)
})

module.exports = app;