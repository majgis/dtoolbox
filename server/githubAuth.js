var express = require('express');
var app = express();
var uuid = require('node-uuid');
var secrets = require('./secrets.json');

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

			var githubCode = req.query.code;
			var state = states[req.query.state];
			if (state){
				console.log('The state was recognized.');
				res.status(200);
			} else {
				console.log('SECURITY: Unknown github auth state:', req.query.state);
				res.status(401);
			}
			res.end();
		});

module.exports = app;