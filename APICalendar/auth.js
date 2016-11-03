// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook');
var google = require('googleapis');
var gcal = require('google-calendar');
var passport = require('passport');
var mustache = require('mustache');
var config = require("../config/config");
var fs = require('fs');
var imageUrl, fb_imageUrl, user, facebook_user;

/*
  ===========================================================================
            Setup express + passportjs server for authentication
  ===========================================================================
*/

// Loading login information stored in json
fs.readFile('./APICalendar/client_secret.json',
    function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Load the credentials
        credentials = JSON.parse(content);

        // Google Strategy
        passport.use(new GoogleStrategy({
                clientID: credentials.google.client_id,
                clientSecret: credentials.google.client_secret,
                callbackURL: credentials.google.callback_url,
                scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'],
                enableProof: true
            },
            function(accessToken, refreshToken, profile, done) {
                imageUrl = retrieveImageUrl(profile);
                user = profile;
                console.log("%s logged in!", user.displayName);
                profile.accessToken = accessToken;
                return done(null, profile);
            }
        ));

        credentials.facebook = debug() ? credentials.facebook_dev : credentials.facebook;

        // Facebook Strategy
        passport.use(new FacebookStrategy({
                clientID: credentials.facebook.client_id,
                clientSecret: credentials.facebook.client_secret,
                callbackURL: credentials.facebook.callback_url,
                scope: ['user_birthday ', 'user_events '],
                profileFields: ['id', 'displayName', 'photos']
            },
            function(accessToken, refreshToken, profile, done) {
                facebook_user = profile;
                facebook_user.accessToken = accessToken;
                console.log("Facebook %s logged in!", facebook_user.displayName);
                console.log(accessToken);
                console.log(profile);
                return done(null, profile);
            }
        ));
    });

function debug() {
    return config.web.port == 8080;
}
/*
  ===========================================================================
                            Auxialliary methods
  ===========================================================================
*/

function retrieveImageUrl(profile) {
    if (typeof profile._json['picture'] != "undefined")
        return profile._json['picture'];
    return profile._json.image['url'];
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


/*
  ===========================================================================
                            Login com Google
  ===========================================================================
*/

/* GET auth */
router.get('/',
    passport.authenticate('google'));

/* GET session info */
router.get('/session', function(req, res) {
    console.log(req.session);
    res.send(req.session);
});

/* GET google pic */
router.get('/img', function(req, res) {
    try { // check undefined passport.user
        res.send(retrieveImageUrl(req.session.passport.user));
    } catch (err) {
        res.send(req.cookies.imageUrl);
    }
});

/* GET google user */
router.get('/user', function(req, res) {
    try { // check undefined passport.user
        res.send(req.session.passport.user);
    } catch (err) {
        res.send(req.cookies.user);
    }
});

/* GET auth callback */
router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        req.session.access_token = req.user.accessToken;
        res.cookie('token', req.user.accessToken);
        res.cookie('imageUrl', imageUrl);
        res.cookie('user', user);
        res.redirect('/calendar');
    });

/*
  ===========================================================================
                            Login com Facebook
  ===========================================================================
*/

router.get('/facebook',
    passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        req.session.fb_access_token = facebook_user.accessToken;
        res.cookie('fb_token', facebook_user.accessToken);
        res.cookie('fb_user', facebook_user);
        res.redirect('/calendarAuth');
    });

module.exports = router;