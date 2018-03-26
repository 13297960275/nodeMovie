var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
var port = process.env.PORT || 9000;
var app = express();

mongoose.connect('mongodb://localhost/movie');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.locals.moment = require('moment');
// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
// app.use(express.cookieParser());
app.use(cookieSession({
	secret: 'movie'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);

console.log('Server start on ' + port);

//  index page
app.get('/', function(req, res) {
	console.log('session==' + JSON.stringify( req.session.user));
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'index',
			movies: movies
		})
	})
})

//  movie detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	// res.render(id);
	// console.log(id);
	Movie.findById(id, function(err, movie) {

		res.render('movie/detail', {
			title: 'detail',
			movie: movie
		})
	})
})

/*movie module page*/

//  admin movie list page
app.get('/admin/movie/list', function(req, res) {
	console.log('req==' + req);

	Movie.fetch(function(err, movies) {
		console.log('====');

		if (err) {
			console.log(err);
		}
		console.log(movies);

		res.render('movie/list', {
			title: 'admin index',
			movies: movies
		})
	})
})

// admin update movie page
app.get('/admin/movie/:id', function(req, res) {
	var id = req.params.id;
	// res.render(id);
	// console.log(id);
	Movie.findById(id, function(err, movie) {

		res.render('movie/movie', {
			title: 'update movie',
			movie: movie
		})
	})
})

//  admin add movie page
app.get('/admin/movie', function(req, res) {
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
})

/*movie module fun*/

//  admin update movie func
app.post('/admin/movie/edit/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {

			res.render('movie/detail', {
				title: 'movie update',
				movie: movie
			})
		})
	}
})

// admin add movie fun
app.post('/admin/movie/add', function(req, res) {
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
})

//  admin delete movie fun
app.delete('/admin/movie/del', function(req, res) {
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
})

/*user module page*/

//  admin user list page
app.get('/admin/user/list', function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userList', {
			title: 'user list',
			users: users
		})
	})
})

/*user module fun*/

// user sign up fun
app.post('/admin/user/signup', function(req, res) {
	var _user = req.body.user;
	// var _user = req.param('user');
	// var _user = req.params.user;
	console.log('signup:_user====' + _user.name);
	// /user/signup/111?userid=111
	// var _userid = req.query.userid;
	// post {userid:112}
	// var _userid = req.body.userid;

	// var user = new User({
	// 	name: _user.name,
	// 	password: _user.password
	// });

	User.find({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}

		// if (JSON.stringify(user) !== '{}' ) {
		if (user.length > 0) {
			console.log('find:!user====' + JSON.stringify(user));
			return res.redirect('/');
		} else {
			console.log('find:user====' + JSON.stringify(user));
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				} else {
					console.log('save:user====' + user.name);
					res.redirect('/admin/user/list');
				}
			})
		}
	})
})

// user sign up
app.post('/admin/user/signin', function(req, res) {
	var _user = req.body.user;
	console.log('signin:_user====' + _user.name);

	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			console.log('find:user====' + user);
			return res.redirect('/');
		}

		user.comparePassword(_user.password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				console.log('password is matched');

				req.session.user = user;
				return res.redirect('/');
			} else {
				console.log('password is not matched')
				res.redirect('/admin/user/list');
			}
		})
	})
})

//  admin delete user fun
app.delete('/admin/user/del', function(req, res) {
	var id = req.query.id;
	// console.log(id);
	if (id) {
		User.remove({
			_id: id
		}, function(err, user) {
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