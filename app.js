var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');
var githubAuth = require('./server/githubAuth');
var User = require('./server/models/User');
var secrets = require('./server/secrets.json');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || secrets.mongodb.mongoUrl);

app.use(express.static(__dirname + '/public'))
		.use('/login', githubAuth)
		.use(cookieParser())
		.engine('handlebars', handlebars())
		.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	var token = req.cookies.token;
	if (token){
		User.find({uid: token}, function (err, users) {
			if (err) throw err;
			var user;
			if (users.length > 0) {
				user = users[0];
				console.log('user found:', user.userId);

				res.render('index', {
					isAuthenticated: true,
					userId: user.userId,
					avatarUrl: user.avatar_url
				});
			} else {
				res.render('index');
			}
		});
	} else {
		res.render('index', {test:true});
	}


});

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);
