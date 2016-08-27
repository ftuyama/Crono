// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

/* GET home page */
router.get('/', function(req, res) {
    res.sendFile(__dirname + "/view/" + '/principal.html');
    console.log("Servindo o mestre.");

    // Processing cookies
    if (req.cookies != undefined) {
        saved_number = req.cookies.number;
        if (saved_number == undefined || saved_number == null) {
            saved_number = 1;
        } else {
            saved_number++;
        }
        res.cookie('number', saved_number);
        console.log("Cookies sent: ", res.cookies);
    }
})

module.exports = router;