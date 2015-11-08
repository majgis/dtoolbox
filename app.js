var express = require('express');
var app = express();
var githubAuth = require('./server/githubAuth');

var secrets = require('./server/secrets.json');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || secrets.mongodb.mongoUrl);

app.use(express.static(__dirname + '/public'))
    .use('/login', githubAuth);

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);
