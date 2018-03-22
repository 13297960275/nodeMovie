var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var movie = require('./models/movie');
var _ = require('underscore');
var bodyParser = require('body-parser');
var port = process.env.PORT || 9000;
var app = express();

mongoose.connect('mongodb://localhost/movie')

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.locals.moment = require('moment');
// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);

console.log('Server start on ' + port);

//  index page
app.get('/', function(req, res) {
	movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'index',
			movies: movies
		})
	})

	// res.render('index', {
	// 	title: 'index',
	// 	movies: [{
	// 		_id: 1,
	// 		title: '1',
	// 		poster: '1'
	// 	}, {
	// 		_id: 2,
	// 		title: '2',
	// 		poster: '2'
	// 	}]
	// })
})

//  detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	// res.render(id);
	console.log(id);
	movie.findById(id, function(err, movie) {

		res.render('detail', {
			title: 'detail',
			movie: movie
		})
	})

	// res.render('detail', {
	// 	title: 'detail',
	// 	movie: {
	// 		title: '1',
	// 		doctor: '1',
	// 		country: '1',
	// 		language: '1',
	// 		poster: '1',
	// 		flash: 'https://moco.imooc.com/mocoplayer/2.7.2/mocoplayer.swf?v=2.7',
	// 		year: '1',
	// 		summary: '1'
	// 	}
	// })
})

// admin update page
app.get('/admin/movie/:id', function(req, res) {
	var id = req.params.id;
	// res.render(id);
	console.log(id);
	movie.findById(id, function(err, movie) {

		res.render('admin', {
			title: 'update movie',
			movie: movie
		})
	})


	// res.render('admin', {
	// 	title: 'update movie',
	// 	movie: {
	// 		title: '1',
	// 		doctor: '1',
	// 		country: '1',
	// 		language: '1',
	// 		poster: '1',
	// 		flash: 'https://moco.imooc.com/mocoplayer/2.7.2/mocoplayer.swf?v=2.7',
	// 		year: '1',
	// 		summary: '1'
	// 	}
	// })
})

//  admin add movie page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
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
})

//  admin update movie func
app.post('/admin/update/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		movie.findById(id, function(err, movie) {

			res.render('detail', {
				title: 'movie update',
				movie: movie
			})
		})
	}
})

// admin add movie fun
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	console.log(_movie);

	if (id !== 'undefined') {
		console.log("1");

		movie.findById(id, function(err, movie) {
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
		console.log("2");
		_movie = new movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year,
		});
		console.log(_movie);
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			console.log(movie);

			res.redirect('/movie/' + movie._id);
		})
	}
})

//  admin list page
app.get('/admin/list', function(req, res) {
	movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: 'admin index',
			movies: movies
		})
	})

	// res.render('list', {
	// 	title: 'admin index',
	// 	movies: [{
	// 		_id: 1,
	// 		title: '1',
	// 		doctor: '1',
	// 		country: '1',
	// 		language: '1',
	// 		// poster: '1',
	// 		entryTime: '',
	// 		flash: 'https://moco.imooc.com/mocoplayer/2.7.2/mocoplayer.swf?v=2.7',
	// 		year: 2016,
	// 		// summary: '1'
	// 	}, {
	// 		_id: 2,
	// 		title: '2',
	// 		doctor: '2',
	// 		country: '2',
	// 		language: '2',
	// 		// poster: '2',
	// 		entryTime: '',
	// 		flash: 'https://moco.imooc.com/mocoplayer/2.7.2/mocoplayer.swf?v=2.7',
	// 		year: 2026,
	// 		// summary: '2'
	// 	}]
	// })
})

//  admin delete movie
app.delete('/admin/list', function(req, res) {
	var id = req.query.id;

	if (id) {
		movie.remove({
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
})