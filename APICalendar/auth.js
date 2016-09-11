// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var google = require('googleapis');
var gcal = require('google-calendar');
var passport = require('passport');
var mustache = require('mustache');
var fs = require('fs');
var imageUrl;

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
            callbackURL: "/calendarAuth/callback",
            scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
        },
        function(accessToken, refreshToken, profile, done) {
            if (typeof profile._json != "undefined")
                imageUrl = profile._json['picture'];
            if (typeof profile.photos != "undefined")
                imageUrl = profile.photos['value'];
            console.log(profile);
            console.log("User logged in!" + imageUrl);
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    ));
});

/* GET auth */
router.get('/',
    passport.authenticate('google', { session: false }));

/* GET auth callback */
router.get('/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/calendar' }),
    function(req, res) {
        req.session.access_token = req.user.accessToken;
        res.cookie('token', req.user.accessToken);
        res.cookie('imageUrl', imageUrl);
        res.redirect('/calendar');
    });

module.exports = router;