/*
  ===========================================================================
            About Application written with Nodejs Server
  ===========================================================================
*/
// Importing packages
var express = require('express');
var router = express.Router();
var fs = require("fs");
var mustache = require('mustache');

/* GET home page */
router.get('/', function(req, res) {
    var page = fs.readFileSync("web/view/about.html", "utf8");
    res.send(mustache.to_html(page));
})

/* GET sitemap */
router.get('/sitemap', function(req, res) {
    var sitemap = fs.readFileSync("config/sitemap.txt", "utf8");
    res.send(sitemap);
})

/* GET privacy politics */
router.get('/politics', function(req, res) {
    var sitemap = fs.readFileSync("config/privacy_politics.html", "utf8");
    res.send(sitemap);
})

module.exports = router;