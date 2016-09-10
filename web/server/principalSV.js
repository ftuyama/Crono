// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser');
var mustache = require('mustache');
var firebase = require("firebase");
var myFirebaseRef;

firebase.initializeApp({
    databaseURL: 'https://friendlychat-e3ac2.firebaseio.com/',
    serviceAccount: 'FriendlyChat-dd9d136c0ce2.json', //this is file that I downloaded from Firebase Console
});

/* GET home page */
router.get('/', function(req, res) {
    // Processing cookies
    if (req.cookies != undefined) {
        saved_number = req.cookies.number;
        if (saved_number == undefined || saved_number == null) {
            saved_number = 1;
        } else {
            saved_number++;
        }
        res.cookie('number', saved_number);

        saved_token = req.cookies.token;
        if (saved_token != undefined && saved_token != null) {
            req.session.access_token = saved_token;
        }
    }
    //myFirebaseRef = new Firebase("https://FriendlyChat.firebaseio.com/");

    var page = fs.readFileSync("web/view/principal.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})


router.get('/set', function(req, res) {
    firebase.database().ref('/').set({
        username: "test",
        email: "test@mail.com"
    });
    firebase.database().ref('/').child('Tuyama COdao').set({
        estudante: "test",
        email: "test@mail.com"
    });

    var page = fs.readFileSync("web/view/principal.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})

router.get('/get', function(req, res) {
    firebase.database().ref('/').on("value", function(snapshot) {
        console.log("x");
        console.log(snapshot.val()); // Alerts "something"
        console.log("x");
    });


    var page = fs.readFileSync("web/view/principal.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})

module.exports = router;