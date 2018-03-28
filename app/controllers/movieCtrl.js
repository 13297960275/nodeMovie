var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');


//  movie detail page
exports.movieDetail = function(req, res) {
	var id = req.params.id;
	// res.render(id);
	// console.log(id);
	Movie.findById(id, function(err, movie) {
		Comment
			.find({
				movie: id
			})
			.populate('from', "name")
			.exec(function(err, comments) {
				res.render('movie/detail', {
					title: 'detail',
					movie: movie,
					comments: comments
				})
			})
	})
}

/*movie module page*/

//  admin movie list page
exports.getMovies = function(req, res) {
	// console.log('req==' + req);

	Movie.fetch(function(err, movies) {
		console.log('====');

		if (err) {
			console.log(err);
		}
		// console.log(movies);

		res.render('movie/list', {
			title: 'admin index',
			movies: movies
		})
	})
}

// admin update movie page
exports.editMovie = function(req, res) {
	var id = req.params.id;
	// res.render(id);
	// console.log(id);
	Movie.findById(id, function(err, movie) {

		res.render('movie/movie', {
			title: 'update movie',
			movie: movie
		})
	})
}

//  admin add movie page
exports.addMovie = function(req, res) {
	res.render('movie/movie', {
		title: 'admin movie',
		movie: {
			title: '',
			doctor: '',
			country: '',
			language: '',
			poster: '',
			flash: '',
			year: '',
			summary: ''
		}
	})
}

/*movie module fun*/

//  admin update movie func
exports.editMovieFun = function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {

			res.render('movie/detail', {
				title: 'movie update',
				movie: movie
			})
		})
	}
}

// admin add movie fun
exports.addMovieFun = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	// console.log(_movie);

	if (id !== 'undefined') {
		// console.log("1");

		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		// console.log("2");
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year,
		});
		// console.log(_movie);
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			// console.log(movie);

			res.redirect('/movie/' + movie._id);
		})
	}
}

//  admin delete movie fun
exports.delMovieFun = function(req, res) {
	var id = req.query.id;
	// console.log(id);
	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				});
			}
		})
	}
}