// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser');
var mustache = require('mustache');
var request = require('request');

/* GET home page */
router.get('/', function(req, res) {
    // Processing cookies
    if (req.cookies != undefined) {
        saved_number = req.cookies.number;
        if (saved_number == undefined || saved_number == null)
            saved_number = 1;
        else saved_number++;
        res.cookie('number', saved_number);

        saved_token = req.cookies.token;
        if (saved_token != undefined && saved_token != null) {
            req.session.access_token = saved_token;
        }
    }

    var page = fs.readFileSync("web/view/principal.html", "utf8");
    res.send(mustache.to_html(page, { show: false }));
})

/*
  ===========================================================================
            Firebase CRUD HelloWorld implementation
  ===========================================================================
*/

router.get('/set', function(req, res) {
    var content = {
        url: '/Tuyama COdao',
        content: {
            username: "test",
            email: "test@mail.com",
            ok: {
                username: "test2"
            }
        }
    };
    request.post('http://localhost:8080/firebase/set', { json: content },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("ok");
                res.redirect('back');
            }
        }
    );
})

router.get('/get', function(req, res) {
    var content = {
        url: '/Tuyama COdao/ok'
    };
    request.post('http://localhost:8080/firebase/get', { json: content },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("ok");
                res.redirect('back');
            }
        }
    );
})

router.get('/upd', function(req, res) {
    var content = {
        url: '/',
        content: {
            "Tuyama COdao": {}
        }
    };
    request.post('http://localhost:8080/firebase/upd', { json: content },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("ok");
                res.redirect('back');
            }
        }
    );
})

router.get('/del', function(req, res) {
    var content = {
        url: '/Tuyama COdao'
    };
    request.post('http://localhost:8080/firebase/del', { json: content },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("ok");
                res.redirect('back');
            }
        }
    );
})

module.exports = router;