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

// Loading login information stored in json
fs.readFile('./APIGit/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Load the credentials
    credentials = JSON.parse(content);
    client = github.client(credentials.web.client_id);

    console.log("User logged in!");
});

/* GET Git list */
router.get('/', function(req, res) {
    client = github.client("45cfd61f7c8c3729435cbec5b38fa9d51dd4968c");
    client.get('/user', {}, function(err, status, body, headers) {
        var page = fs.readFileSync(__dirname + "/../web/view/principal.html", "utf8");
        res.send(mustache.to_html(page, { username: body.login }));
    });
});

module.exports = router;