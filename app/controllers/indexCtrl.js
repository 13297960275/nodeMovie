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
			// console.log('categories == ' + categories);
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

//  get category by page
exports.getCategoryBypage = function(req, res) {
	var catId = req.query.cat; // category id
	var pageNO = parseInt(req.query.page) || 0; // 分页数从0kaishi8
	var pageSize = 2; // 每页显示数据条数
	var q = req.query.q; // 首页搜索movie信息
	console.log(catId + '===' + pageNO + '====' + pageSize + '===' + q);

	if (catId) { // 有catid表示是分页拿category下的movie信息，若无则根据搜索信息拿movie
		Category
			.find({
				_id: catId
			})
			.populate({
				path: 'movies',
				/*options: {
					sort: {
						'meta.createAt': 1
					},
					limit: pageSize, // 拉去数据条数
					skip: pageSize * pageNO // 跳过的数据条数
				}*/
			})
			.exec(function(err, categories) {
				// console.log('categories == ' + categories);
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(pageSize * pageNO, pageSize * pageNO + 2);

				res.render('categoryPage', {
					title: 'category page',
					keywords: category.name,
					query: 'cat=' + catId,
					intro: category.intro,
					currentPage: pageNO + 1,
					totalPage: Math.ceil(movies.length / pageSize),
					movies: results
				})
			})
	} else {
		Movie
			.find({
				title: new RegExp(q + '.*', 'i')
			})
			.exec(function(err, movies) {
				var movies = movies || [];
				var results = movies.slice(pageSize * pageNO, pageSize * pageNO + 2);
				console.log('movies===' + movies);

				res.render('categoryPage', {
					title: 'search results',
					keywords: q,
					query: 'q=' + catId,
					currentPage: pageNO + 1,
					totalPage: Math.ceil(movies.length / pageSize),
					movies: results
				})
			})
	}

}