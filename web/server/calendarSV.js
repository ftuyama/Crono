// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var google = require('googleapis');
var gcal = require('google-calendar');
var passport = require('passport');
var mustache = require('mustache');
var fs = require('fs');

/* GET home page */
router.get('/', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendarAuth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;
    res.send(fs.readFileSync("web/view/calendar.html", "utf8"));
});

/*
  ===========================================================================
            Setup API used by Angular for the application
  ===========================================================================
*/

/* GET Groups List */
router.get('/groups', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendarAuth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;

    //Create an instance from accessToken
    var accessToken = req.session.access_token;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* GET Events List */
router.get('/list:id', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendarAuth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;

    //Create an instance from accessToken
    var accessToken = req.session.access_token;
    var group = req.params.id;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        gcal(accessToken).events.list(data.items[group].id, function(err, data) {
            if (err) return res.redirect('/calendarAuth');
            res.json(data);
        });
    });
});
module.exports = router;