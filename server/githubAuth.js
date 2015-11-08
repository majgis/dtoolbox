var express = require('express');
var app = express();
var uuid = require('node-uuid');
var secrets = require('./secrets.json');
var request = require('request');

//TODO: Move to database before scaling
var states = {};

var User = require('./models/User');


app
		//Redirect to github
		.get('/github', function (req, res) {
			var state = uuid.v4();
			states[state] = {
				redirectUri: req.get('Referrer')
			};
			res.redirect('https://github.com/login/oauth/authorize?client_id='
					+ secrets.github.clientId + '&state=' + state);
		})

		//Redirect back from github
		.get('/github/authorize', function (req, res) {

			var stateKey = req.query.state;
			var stateValue = states[stateKey];

			if (stateValue){
				delete states[stateKey];
				console.log('The state was recognized.');

				var githubCode = req.query.code;

				request({
					url: "https://github.com/login/oauth/access_token",
					method: "POST",
					json: true,
					body: {
						client_id: secrets.github.clientId,
						client_secret: secrets.github.clientSecret,
						code: githubCode,
						state: stateKey
					}
				}, function (error, response, body){
					if (error){
						console.log("There was an issue getting the github access token:", error);
						res.redirect('/');
					} else {


						request({
							url: "https://api.github.com/user",
							method: "GET",
							json: true,
							headers: {
								Authorization: 'token ' + body.access_token,
								"User-Agent": secrets.github.userAgent
							}
						}, function (error, response, body){

							if (error) throw error;

							console.log(body);
							var userId = body.login;
							User.find({ userId: userId}, function(err, users){
								if (err) throw err;
								var user;
								if (users.length > 0){
									user = users[0];
									console.log('user found:', user.userId);
								} else {
									user = new User({
										userId: userId
									});
								}

								user.avatar_url = body.avatar_url;
								user.save(function(err){
									if (err) throw err;
									console.log("User updated: ", userId);
									res.redirect('/');
								});
							});
						});
					}
				});

			} else {
				console.log('SECURITY: Unknown github auth state:', stateKey);
				res.status(401).end();
			}
		});

module.exports = app;