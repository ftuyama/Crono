// Importação dos modulos necessários.
var express = require('express');
var app = express();

var calendar = require('./APICalendar/auth');
var project = require('./APIGit/auth');
var principal = require('./web/contrl/principal');
var index = require('./web/contrl/index');
var users = require('./web/contrl/users');

var session = require('express-session')
var cookieParser = require('cookie-parser');
var passport = require('passport');

/*
  ===========================================================================
            Setup filesystem and express for the application
  ===========================================================================
*/

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/web/view'));
//Store all JS in Scripts folder.
app.use(express.static(__dirname + '/web/script'));
//Store all CSS in style folder.
app.use(express.static(__dirname + '/web/style'));
//Store all Assets in web folder
app.use(express.static(__dirname + '/web'));

// Configure server
app.use(cookieParser());
app.use(session({
    secret: 'my easter egg',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());

app.use('/calendar', calendar);
app.use('/project', project);
app.use('/users', users);
app.use('/main', principal);
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