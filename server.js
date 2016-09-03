// Importação dos modulos necessários.
var express = require('express');
var app = express();
var fs = require("fs");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/view'));
//Store all JS in Scripts folder.
app.use(express.static(__dirname + '/script'));
//Store all CSS in style folder.
app.use(express.static(__dirname + '/style'));
//Store all static files
app.use(express.static(__dirname + '/assets'));
//Store all cookies.
app.use(cookieParser())
    //Bower modules are used too.
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/view/main.html");
})

app.get('/demo_bg', function(req, res) {
    res.sendFile(__dirname + "/view/demo_bg.html");
})

app.get('/semana1', function(req, res) {
    res.sendFile(__dirname + "/view/semana1.html");
})

app.get('/semana2', function(req, res) {
    res.sendFile(__dirname + "/view/semana2.html");
})

app.get('/semana3', function(req, res) {
    res.sendFile(__dirname + "/view/semana3.html");

    // Processing cookies
    console.log("Cookies got: ", req.cookies);
    saved_number = req.cookies.number;
    if (saved_number == 'undefined' || saved_number == null) {
        saved_number = 1;
    } else {
        saved_number++;
    }
    res.cookie('number', saved_number);
    console.log("Cookies sent: ", res.cookies);
})

app.get('/listUser', function(req, res) {
    fs.readFile(__dirname + "/data/users.json", 'utf8', function(err, data) {
        console.log(data);
        res.end(data);
        console.log("Listando usuarios.");
    });
})

app.get('/addUser', function(req, res) {
    fs.readFile(__dirname + "/data/users.json", 'utf8', function(err, data) {
        data = JSON.parse(data);
        id = Math.floor(Math.random() * 10000);
        data["user" + id] = {
            name: req.query.name,
            pass: req.query.pass,
            profession: req.query.vocation,
            id: id
        };
        console.log(data);
        res.end(JSON.stringify(data));

        fs.writeFile(__dirname + "/data/users.json", JSON.stringify(data), function(err) {
            console.log("Salvando usuario.");
        });
    });
})

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;