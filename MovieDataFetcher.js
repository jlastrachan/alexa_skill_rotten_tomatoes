'use strict';

var _ = require('lodash');
var rp = require('request-promise');
var MOVIE_SEARCH_ENDPOINT = 'https://www.rottentomatoes.com/api/private/v1.0/search/?catCount=5&q='

function MovieDataFetcher() { }

MovieDataFetcher.prototype.getMovieResults = function(movieName) {
	var uri = encodeURI(MOVIE_SEARCH_ENDPOINT + movieName);
	var options = {
		method: 'GET',
		uri: uri,
		resolveWithFullResponse: true,
		json: true,
	};
	return rp(options);
};

MovieDataFetcher.prototype.formatMovieResult = function(movieResult) {
	var movieList = _.filter(movieResult.movies, function(movie) {
		return Boolean(movie.meterScore);
	});
	var movieCount = movieList.length;
	if (movieCount === 1) {
		var movie = movieList[0];
		return _.template('${movie_title} has a score of ${percent} percent.')({
			movie_title: movie.name,
			percent: movie.meterScore,
		});
	} else if (movieCount > 1) {
		return _.template('I found multiple movies matching that name. ${movie_names_and_scores}')({
			movie_names_and_scores: _.map(movieList, function(movie) {
				var movieString = movie.name;
				if (movie.subline !== '') {
					movieString += ' with ' + movie.subline;
				}
				movieString += ' has a score of ' + movie.meterScore + ' percent. ';
				return movieString;
			}),
		});
	} else {
		return 'I didn\'t find any movies matching that name. Please try again.';
	};
};

module.exports = MovieDataFetcher;
