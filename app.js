var express = require('express');
var app = express();
var githubAuth = require('./server/githubAuth');

app.use(express.static(__dirname + '/public'))
    .use('/login', githubAuth);



var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);
