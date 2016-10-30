/*
  ===========================================================================
            Calendar Application written with Nodejs Server
  ===========================================================================
*/
// Importing packages
var express = require('express');
var router = express.Router();
var gcal = require('google-calendar');
var fbcal = require('fbgraphapi');
var fs = require('fs');

/* GET home page */
router.get('/', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    res.send(fs.readFileSync("web/view/calendar.html", "utf8"));
});

/* GET event list page */
router.get('/list-events', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    res.send(fs.readFileSync("web/view/calendar_events.html", "utf8"));
});

/*
  ===========================================================================
                        Setup Google Calendar API
  ===========================================================================
*/

/* GET Groups List */
router.get('/groups', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* GET Events List */
router.get('/list:id', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    var groupId = req.params.id;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        gcal(accessToken).events.list(data.items[groupId].id, function(err, data) {
            if (err) return res.redirect('/calendarAuth');
            data["group_id"] = groupId;
            res.json(data);
        });
    });
});

/* POST Create Event */
router.post('/create', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.body.group_id;
    var event = JSON.stringify(req.body.event);
    gcal(accessToken).events.insert(group_id, event, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* POST Edit Event */
router.post('/edit', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.body.group_id;
    var event_id = req.body.event_id;
    var event = JSON.stringify(req.body.event);
    gcal(accessToken).events.update(group_id, event_id, event, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* POST Delete Event */
router.get('/delete', function(req, res) {
    var accessToken = req.session.access_token;
    if (accessToken == null) return res.redirect('/calendarAuth');
    var group_id = req.query.group_id;
    var event_id = req.query.event_id;
    gcal(accessToken).events.delete(group_id, event_id, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/*
  ===========================================================================
                        Setup Facebook Calendar API
  ===========================================================================
*/

router.get('/facebook', function(req, res) {
    var fbAccessToken = req.session.fb_access_token;
    if (isNull(fbAccessToken)) res.status(404).send("Facebook auth");
    else {
        var fb = new fbcal.Facebook(fbAccessToken, 'v2.8');
        fb.my.events(function(err, data) {
            res.send(data)
        });
    }
});

function isNull(token) {
    return token == undefined || token == null ||
        token == "undefined" || token == "";
}

module.exports = router;