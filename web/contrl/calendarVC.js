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
    var page = fs.readFileSync("web/view/calendar.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})


router.get('/list', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendar/auth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;

    //Create an instance from accessToken
    var accessToken = req.session.access_token;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.status(500).send(err);
        var user_id = data.items[0].id;
        gcal(accessToken).events.list(user_id, function(err, data) {
            if (err) return res.status(500).send(err);
            var page = fs.readFileSync(__dirname + "/../view/calendar.html", "utf8");
            res.send(mustache.to_html(page, { show: true, events: data }));
        });
    });
});
module.exports = router;