var Movie = require('../models/movie');
var Category = require('../models/category');

//  index page
exports.index = function(req, res) {
	// console.log('index session==' + JSON.stringify(req.session.user));
	// console.log('session obj==' + typeof req.session.user);
	Category
		.find({})
		.populate({
			path: 'movies',
			options: {
				limit: 10
			}
		})
		.exec(function(err, categories) {
			console.log('categories == ' + categories);
			res.render('index', {
				title: 'index',
				categories: categories
			})
		})
	// Movie.fetch(function(err, movies) {
	// 	if (err) {
	// 		console.log(err);
	// 	}

	// 	res.render('index', {
	// 		title: 'index',
	// 		movies: movies
	// 	})
	// })
}