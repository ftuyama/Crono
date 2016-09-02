// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser');
var mustache = require('mustache');

/* GET home page */
router.get('/', function(req, res) {
    var page = fs.readFileSync(__dirname + "/view/index.html", "utf8");
    res.send(mustache.to_html(page));
})

module.exports = router;