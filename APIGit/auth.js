// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var mustache = require('mustache');
var github = require('octonode');
var fs = require('fs');
var client;

/*
  ===========================================================================
            Setup express + passportjs server for authentication
  ===========================================================================
*/

/* GET Git login */
router.get('/auth', function(req, res) {
    // Loading login information stored in json
    fs.readFile('./APIGit/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Load the credentials
        console.log("User logged in!");
        credentials = JSON.parse(content);
        req.session.git_access_token = credentials.web.access_token;
        res.cookie('git_token', credentials.web.access_token);
        res.redirect('/project/');
    });
});

/* GET Git list */
router.get('/', function(req, res) {
    if (!req.session.git_access_token && !req.cookies.git_token) return res.redirect('/project/auth');
    if (!req.session.git_access_token) req.session.git_access_token = req.cookies.git_token;

    //Create an instance from accessToken
    var accessToken = req.session.git_access_token;
    console.log(accessToken);
    client = github.client(accessToken);
    client.get('/user', {}, function(err, status, body, headers) {
        if (err) return res.status(500).send(err);
        var page = fs.readFileSync(__dirname + "/../web/view/principal.html", "utf8");
        res.send(mustache.to_html(page, { username: body.login }));
    });
});

module.exports = router;