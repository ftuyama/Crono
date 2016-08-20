var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res) {
  res.sendFile(__dirname + "/view/" + '/users.html');
  console.log("Servindo o mestre users.");
})

router.get('/listUser', function(req, res) {
  fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function (err, data) {
    console.log(data);
    res.end(data);
    console.log("Listando usuarios.");
  });
})

router.get('/queryUser', function (req, res) {
  fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function (err, data) {
    console.log(data);
    var dataQuery = {};
    data = JSON.parse(data);
    console.log("Listando usuarios.");
    for (var prop in data) {
      if (data[prop].name == req.query.name){
        console.log("Key " + prop);
        
        dataQuery[prop] = data[prop];
        console.log("valor " + JSON.stringify(dataQuery[prop]));
      }
    }
    //name: req.query.name,
    res.end(JSON.stringify(dataQuery));
  });
})


router.get('/addUser', function (req, res) {
   fs.readFile( __dirname + "/data/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse(data);
       id = Math.floor(Math.random()*10000);
       data["user" + id] = {
         name: req.query.name,
         pass: req.query.pass,
         profession: req.query.vocation,
         id: id
       };
       console.log(data);
       res.end(JSON.stringify(data));
       
        fs.writeFile( __dirname + "/data/" + "users.json", JSON.stringify(data), function (err) {
          console.log("Salvando usuario.");
        });
   });
})


module.exports = router;