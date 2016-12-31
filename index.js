'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('movieinfo');
var MovieDataFetcher = require('./MovieDataFetcher');

app.launch(function(req, res) {
  var prompt = 'Which movie would you like to hear about?';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('movieinfo', {
	'slots': {
		'MOVIENAME': 'AMAZON.Movie'
	},
	'utterances': ['{|about} {-|MOVIENAME}']
},
	function(req, res) {
		var movieName = req.slot('MOVIENAME');
		var reprompt = 'Tell me a movie name to get information.';

		if (_.isEmpty(movieName)) {
			var prompt = 'I didn\'t hear a movie name. Tell me an movie name.';
			res.say(prompt).reprompt(reprompt).shouldEndSession(false);
			return true;
		} else {
			var movieHelper = new MovieDataFetcher();
			movieHelper.getMovieResults(movieName).then(function(movieResult) {
				res.say(movieHelper.formatMovieResult(movieResult.body)).send();
			}).catch(function(err) {
				console.log(err.statusCode);
				var prompt = 'I couldn\'t find information about ' + movieName;
				res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
			});
			return false;
		}
	}
);

module.exports = app;
