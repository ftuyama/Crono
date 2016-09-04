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
        req.session.git_user = credentials.web.user;
        req.session.git_pass = credentials.web.pass;
        res.cookie('git_user', credentials.web.user);
        res.cookie('git_pass', credentials.web.pass);
        res.redirect('/');
    });
});

/* GET Git list */
router.get('/', function(req, res) {
    if (!req.session.git_user && !req.cookies.git_user) return res.redirect('/projectAuth/auth');
    if (!req.session.git_user) {
        req.session.git_user = req.cookies.git_user;
        req.session.git_pass = req.cookies.git_pass;
    }
    // Git Login using user and pass
    client = github.client({
        username: req.session.git_user,
        password: req.session.git_pass
    });
    client.get('/user', {}, function(err, status, body, headers) {
        if (err) return res.status(500).send(err);
        var page = fs.readFileSync(__dirname + "/../web/view/principal.html", "utf8");
        res.send(mustache.to_html(page, { username: body.login }));
    });
});

module.exports = router;