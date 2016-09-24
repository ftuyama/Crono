var express = require('express');
var router = express.Router();
var fs = require("fs");
var mustache = require('mustache');

/* Dinamically renders the page */
function renderPage(dict) {
    var page = fs.readFileSync("web/view/users.html", "utf8");
    return mustache.to_html(page, dict);
}

/* GET home page. */
router.get('/', function(req, res) {
    res.send(renderPage({ name: "#Ipatinga - codão" }));
})

/* GET List */
router.get('/listUser', function(req, res) {
    fs.readFile("web/public/data/users.json", 'utf8', function(err, data) {
        res.send(renderPage({ response: data, op: "Lista" }));
    });
})

/* GET Query */
router.get('/queryUser', function(req, res) {
    fs.readFile("web/public/data/users.json", 'utf8', function(err, data) {
        var dataQuery = {};
        data = JSON.parse(data);
        for (var prop in data) {
            if (data[prop].name == req.query.name) {
                dataQuery[prop] = data[prop];
            }
        }
        res.send(renderPage({ response: JSON.stringify(dataQuery), op: "Busca" }));
    });
})

/* GET Add */
router.get('/addUser', function(req, res) {
    fs.readFile("web/public/data/users.json", 'utf8', function(err, data) {
        data = JSON.parse(data);
        id = Math.floor(Math.random() * 10000);
        data["user" + id] = {
            name: req.query.name,
            pass: req.query.pass,
            profession: req.query.vocation,
            id: id
        };
        res.send(renderPage({ response: JSON.stringify(data), op: "Adição" }));

        fs.writeFile("web/public/data/users.json", JSON.stringify(data), function(err) {
            console.log("Salvando usuario.");
        });
    });
})

module.exports = router;