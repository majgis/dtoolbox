var express = require('express');
var app = express();
var uuid = require('node-uuid');
var secrets = require('./secrets.json');
var request = require('request');

//TODO: Move to database before scaling
var states = {};

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
						console.log('body', body);
						res.append('Authentication', body.access_token);
						res.redirect('/');
					}
				});

			} else {
				console.log('SECURITY: Unknown github auth state:', stateKey);
				res.status(401).end();
			}
		});

module.exports = app;