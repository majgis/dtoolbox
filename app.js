var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');
var githubAuth = require('./server/githubAuth');

var secrets = require('./server/secrets.json');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || secrets.mongodb.mongoUrl);

app.use(express.static(__dirname + '/public'))
		.use('/login', githubAuth)
		.use(cookieParser())
		.engine('handlebars', handlebars())
		.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	console.log('token:', req);
	res.render('index');
});

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);
