// Importação dos modulos necessários.
var express = require('express');
var app = express();

var calendarAuth = require('./APICalendar/auth');
var projectAuth = require('./APIGit/auth');
var principal = require('./web/server/principalSV');
var index = require('./web/server/indexSV');
var users = require('./web/server/usersSV');
var calendar = require('./web/server/calendarSV');
var about = require('./web/server/aboutSV');

var session = require('express-session');
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

// Configure server
app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret: 'my easter egg',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());

app.use('/calendarAuth', calendarAuth);
app.use('/projectAuth', projectAuth);
app.use('/calendar', calendar);
app.use('/users', users);
app.use('/main', principal);
app.use('/about', about);
app.use('/', index);

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;