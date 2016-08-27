// Importação dos modulos necessários.
var express = require('express');
var app = express();
var routes = require('./web/principal');
var users = require('./web/users');
var session = require('express-session')
var fs = require('fs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
var cookieParser = require('cookie-parser');

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/web/view'));
//Store all JS in Scripts folder.
app.use(express.static(__dirname + '/web/script'));
//Store all CSS in style folder.
app.use(express.static(__dirname + '/web/style'));
//Bower modules are used too.
app.use(express.static(__dirname + '/web/bower_components'));

// Configure server
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());

app.use('/users', users);
app.use('/', routes);

/*
  ===========================================================================
            Setup express + passportjs server for authentication
  ===========================================================================
*/

fs.readFile('./client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Load the credentials
    credentials = JSON.parse(content);

    passport.use(new GoogleStrategy({
            clientID: credentials.web.client_id,
            clientSecret: credentials.web.client_secret,
            callbackURL: "http://localhost:8081/auth/callback",
            scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("User logged in!")
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    ));
});

app.get('/auth',
    passport.authenticate('google', { session: false }));

app.get('/auth/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        req.session.access_token = req.user.accessToken;
        res.redirect('/');
    });

app.all('/calendar', function(req, res) {

    if (!req.session.access_token) return res.redirect('/auth');

    //Create an instance from accessToken
    var accessToken = req.session.access_token;

    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.send(500, err);
        return res.send(data);
    });
});

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;