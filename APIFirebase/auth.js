// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var fs = require('fs');

fs.readFile('./APIFirebase/client_secret.json',
    function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        credentials = JSON.parse(content);
        firebase.initializeApp(credentials);
    });

/*
    ===========================================================================
                            CRUD Firebase Database
    ===========================================================================
*/

router.post('/set', function(req, res) {
    console.log("setting: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).set(req.body.content);
    res.send();
})

router.post('/get', function(req, res) {
    console.log("getting: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).once("value", function(snapshot) {
        res.send(snapshot.val());
    });
})

router.get('/fetch', function(req, res) {
    console.log("fetching");
    firebase.database().ref('root').root
        .orderByKey().once("value", function(snapshot) {
            res.send(snapshot.val());
        });
})

router.post('/upd', function(req, res) {
    console.log("updating: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).update(req.body.content);
    res.send();
})

router.post('/del', function(req, res) {
    console.log("deleting: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).remove();
    res.send();
})

module.exports = router;