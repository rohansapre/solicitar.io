/**
 * Created by amulmehta on 3/26/17.
 */
require('dotenv').load();
var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

require ("./setup/app.js")(app);


var options = {
    key: fs.readFileSync('setup/keys/agent2-key.pem'),
    cert: fs.readFileSync('setup/keys/agent2-cert.pem')
};




var server = require('./server/app.js');
server(app);

//app.listen(9000);

// Create an HTTP service.
app.listen(9000);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8443);