// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var google = require('googleapis');
var gcal = require('google-calendar');
var passport = require('passport');
var mustache = require('mustache');
var fs = require('fs');

/*
  ===========================================================================
            Setup express + passportjs server for authentication
  ===========================================================================
*/

// Loading login information stored in json
fs.readFile('./APICalendar/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Load the credentials
    credentials = JSON.parse(content);

    passport.use(new GoogleStrategy({
            clientID: credentials.web.client_id,
            clientSecret: credentials.web.client_secret,
            callbackURL: "/calendar/auth/callback",
            scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("User logged in!");
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    ));
});

/* GET auth */
router.get('/auth',
    passport.authenticate('google', { session: false }));

/* GET auth callback */
router.get('/auth/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        req.session.access_token = req.user.accessToken;
        res.cookie('token', req.user.accessToken);
        res.redirect('/');
    });

/* GET events list */
router.get('/', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/auth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;

    //Create an instance from accessToken
    var accessToken = req.session.access_token;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.status(500).send(err);
        var user_id = data.items[0].id;
        gcal(accessToken).events.list(user_id, function(err, data) {
            if (err) return res.status(500).send(err);
            var page = fs.readFileSync(__dirname + "/../web/view/principal.html", "utf8");
            res.send(mustache.to_html(page, { show: true, events: data }));
        });
    });
});

module.exports = router;