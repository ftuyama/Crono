/*
  ===========================================================================
            Calendar Application written with Nodejs Server
  ===========================================================================
*/
// Importing packages
var express = require('express');
var router = express.Router();
var gcal = require('google-calendar');
var fs = require('fs');

/* GET home page */
router.get('/', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendarAuth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;
    res.send(fs.readFileSync("web/view/calendar.html", "utf8"));
});

/* Authentication function */

function retrieveToken(req, res) {
    if (!req.session.access_token && !req.cookies.token) return null;
    if (!req.session.access_token) req.session.access_token = req.cookies.token;
    return req.session.access_token;
}

/*
  ===========================================================================
            Setup API used by Angular for the application
  ===========================================================================
*/

/* GET Groups List */
router.get('/groups', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* GET Events List */
router.get('/list:id', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var groupId = req.params.id;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        gcal(accessToken).events.list(data.items[groupId].id, function(err, data) {
            if (err) return res.redirect('/calendarAuth');
            res.json(data);
        });
    });
});

/* POST Create Event */
router.post('/create', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.body.group_id;
    var event = JSON.stringify(req.body.event);
    console.log(group_id);
    console.log(event);
    gcal(accessToken).events.insert(group_id, event, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        console.log("ok" + err);
        res.json(data);
    });
});

/* POST Edit Event */
router.post('/edit', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.body.group_id;
    var event_id = req.body.event_id;
    var event = JSON.stringify(req.body.event);
    gcal(accessToken).events.insert(group_id, event_id, event, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* POST Delete Event */
router.get('/delete', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.query.group_id;
    var event_id = req.query.event_id;
    console.log(group_id);
    console.log(event_id);
    gcal(accessToken).events.delete(group_id, event_id, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

module.exports = router;