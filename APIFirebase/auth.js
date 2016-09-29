// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var firebase = require("firebase");

firebase.initializeApp({
    databaseURL: 'https://crono-b0853.firebaseio.com/',
    serviceAccount: 'APIFirebase/Crono.json',
});

router.post('/set', function(req, res) {
    console.log("setting: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).set(req.body.content);
    res.send();
})

router.post('/get', function(req, res) {
    console.log("getting: " + JSON.stringify(req.body));
    firebase.database().ref(req.body.url).on("value", function(snapshot) {
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