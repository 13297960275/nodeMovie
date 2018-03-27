var Movie = require('../models/movie');

//  index page
exports.index = function(req, res) {
	// console.log('index session==' + JSON.stringify(req.session.user));
	// console.log('session obj==' + typeof req.session.user);

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'index',
			movies: movies
		})
	})
}