// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var mustache = require('mustache');

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

    var page = fs.readFileSync(__dirname + "/view/principal.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})

module.exports = router;