/*
  ===========================================================================
            Index Application written with Nodejs Server
  ===========================================================================
*/
// Importing packages
var express = require('express');
var router = express.Router();
var fs = require("fs");
var qs = require('qs');
var mustache = require('mustache');
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(
    'smtps://crono.robot%40gmail.com:ipatingacodao@smtp.gmail.com'
);

/* GET home page */
router.get('/', function(req, res) {
    var page = fs.readFileSync("web/view/index.html", "utf8");
    res.send(mustache.to_html(page));
})

/* POST Send Email */
router.post('/mail', function(req, res) {
    var body = '';

    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function() {
        var post = qs.parse(body);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Crono" <crono-robot@gmail.com>', // sender address
            to: post.email, // list of receivers
            subject: 'Crono', // Subject line
            text: 'Hello dear ' + post.name + ',' +
                ' we have received your sent message: ' +
                post.message, // plaintext body
            html: '<p>Hello dear <b>' + post.name + '</b>,</p>' +
                '<p> We have received your sent message: </p>' +
                post.message, // plaintext body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.sendStatus(403);
                return console.log(error);
            }
            console.log("Mail: " + post.name + " : " + post.email + " > " + post.message);
            console.log('Message sent: ' + info.response);
            res.sendStatus(200);
        });
    });
});

module.exports = router;