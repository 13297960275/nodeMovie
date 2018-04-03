var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');


//  movie detail page
exports.movieDetail = function(req, res) {
	var id = req.params.id;
	// console.log(id);

	Movie.update({ // pv +1
			_id: id
		}, {
			$inc: {
				pv: 1
			}
		},
		function(err, movie) {
			if (err) {
				console.log(err);
			}
		})

	Movie.findById(id, function(err, movie) {
		Comment
			.find({
				movie: id
			})
			.populate('from', "name")
			.populate('reply.from reply.to', "name")
			.exec(function(err, comments) {
				// console.log('comments == ' + JSON.stringify(comments));

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
		// console.log('====');

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
		Category.find({}, function(err, categories) {

			res.render('movie/movie', {
				title: 'update movie',
				categories: categories,
				movie: movie
			})
		})
	})
}

//  admin add movie page
exports.addMovie = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('movie/movie', {
			title: 'admin movie',
			categories: categories,
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

/* upload poster */
exports.upload = function(req, res, next) {
	console.log('upload1');
	//Creates a new incoming form.
	var form = new formidable.IncomingForm();
	//设置文件上传存放地址
	form.uploadDir = __dirname + '../../public/upload/poster/';
	//执行里面的回调函数的时候，表单已经全部接收完毕了。
	form.parse(req, function(err, fields, files) {
		console.log(files);
		//使用第三方模块silly-datetime
		var t = new Date();
		//生成随机数
		var ran = parseInt(Math.random() * 8999 + 10000);
		//拿到扩展名
		var extname = path.extname(files.uploadPoster.name);
		//旧的路径
		var oldpath = __dirname + "/" + files.uploadPoster.path;
		//新的路径
		var newpath = __dirname + '../../public/upload/poster/' + t + ran + extname;
		//改名
		fs.rename(oldpath, newpath, function(err) {
			if (err) {
				throw Error("改名失败");
				next();
			}
			next();

		});
		next();
	});

	// 事件
	// progress事件在接收到每一个解析的数据块后触发。 可以根据该事件更新进度条
	// form.on('progress', function(bytesReceived, bytesExpected) {});

	// field时间在接收到一个字段键值对的时候触发
	// form.on('field', function(name, value) {});

	// fileBegin事件在一个新文件开始上传时触发， 如果想改变文件上传的路径， 可以在该事件内定义。
	form.on('fileBegin', function(name, file) {
		console.log(name + '===fileBegin===' + file)
	});

	// file事件在接收到一个文件字段值是触发。 file是File的实例
	// form.on('file', function(name, file) {});

	// error在接收form表单提交的数据发生错误时触发。 如果请求过程中有错误， 该请求将会自动终止。 但是如果你想继续发送请求， 可以使用request.resume() 方法。
	// form.on('error', function(err) {});

	// ‘ aborted’ 事件是当用户中止请求时触发， 上传时间超时或者通过socket关闭事件也可以触发该事件。 该事件触发后， 将会随着触发error时间
	// form.on('aborted', function() {});

	// ‘ end’ 时间在请求完全接收后触发， 即文件已被成功存入磁盘。 通过该事件可以发送响应
	form.on('end', function() {
		console.log('===end===')
	});
}


exports.uploadPoster = function(req, res, next) {
	console.log(req.files);
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFileName = posterData.originalFileName;
	console.log(req.files);

	if (originalFileName) {
		fs.readFile(filePath, function(err, data) {
			var timeStamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timeStamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/poster');

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;
				next();
			})
		})
	} else {
		next();
	}
}

// admin add movie fun
exports.addMovieFun = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	// console.log(movieObj);
	// console.log(id);

	if (req.poster) {
		movieObj.poster = req.poster;
	}

	if (id) { // 有movie id则编辑，没有则新增
		// console.log("1");

		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			console.log(_movie);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		console.log("2");
		_movie = new Movie(movieObj);

		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;
		var categoryIntro = movieObj.categoryIntro;

		// console.log(_movie);
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			// console.log(movie);

			if (categoryId) {
				Category.findById(categoryId, function(err, category) {

					category.movies.push(movie._id);
					category.save(function(err, category) {
						// if (err) {
						// 	console.log(err);
						// }
						res.redirect('/movie/' + movie._id);
						// res.redirect('/admin/movie');
					})
				})
			} else {
				var category = new Category({
					name: categoryName,
					intro: categoryIntro,
					movies: movie._id
				});
				console.log(category);
				category.save(function(err, category) {
					// if (err) {
					// 	console.log(err);
					// }
					res.redirect('/movie/' + movie._id);
					// res.redirect('/admin/movie');
				})
			}
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

/*{
	"rating": {
		"max": 10,
		"average": 7.4,
		"stars": "40",
		"min": 0
	},
	"reviews_count": 301,
	"wish_count": 15748,
	"douban_site": "",
	"year": "2009",
	"images": {
		"small": "https://img1.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p494268647.webp",
		"large": "https://img1.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p494268647.webp",
		"medium": "https://img1.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p494268647.webp"
	},
	"alt": "https:\/\/movie.douban.com\/subject\/1764796\/",
	"id": "1764796",
	"mobile_url": "https:\/\/movie.douban.com\/subject\/1764796\/mobile",
	"title": "\u673a\u5668\u4eba9\u53f7",
	"do_count": null,
	"share_url": "https:\/\/m.douban.com\/movie\/subject\/1764796",
	"seasons_count": null,
	"schedule_url": "",
	"episodes_count": null,
	"countries": ["\u7f8e\u56fd"],
	"genres": ["\u52a8\u753b", "\u5192\u9669", "\u5947\u5e7b"],
	"collect_count": 74412,
	"casts": [{
		"alt": "https:\/\/movie.douban.com\/celebrity\/1054395\/",
		"avatars": {
			"small": "https://img1.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p51597.webp",
			"large": "https://img1.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p51597.webp",
			"medium": "https://img1.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p51597.webp"
		},
		"name": "\u4f0a\u5229\u4e9a\u00b7\u4f0d\u5fb7",
		"id": "1054395"
	}, {
		"alt": "https:\/\/movie.douban.com\/celebrity\/1016673\/",
		"avatars": {
			"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p33305.webp",
			"large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p33305.webp",
			"medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p33305.webp"
		},
		"name": "\u8a79\u59ae\u5f17\u00b7\u5eb7\u7eb3\u5229",
		"id": "1016673"
	}, {
		"alt": "https:\/\/movie.douban.com\/celebrity\/1017907\/",
		"avatars": {
			"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p55994.webp",
			"large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p55994.webp",
			"medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p55994.webp"
		},
		"name": "\u7ea6\u7ff0\u00b7C\u00b7\u8d56\u5229",
		"id": "1017907"
	}, {
		"alt": "https:\/\/movie.douban.com\/celebrity\/1036321\/",
		"avatars": {
			"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p42033.webp",
			"large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p42033.webp",
			"medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p42033.webp"
		},
		"name": "\u514b\u91cc\u65af\u6258\u5f17\u00b7\u666e\u5362\u9ed8",
		"id": "1036321"
	}],
	"current_season": null,
	"original_title": "9",
	"summary": "\u673a\u5668\u4eba9\u53f7\uff08\u4f0a\u5229\u4e9a\u2022\u4f0d\u5fb7 Elijah Wood \u9970\uff09\u7a81\u7136\u9192\u6765\uff0c\u53d1\u73b0\u8eab\u8fb9\u7684\u4e16\u754c\u5145\u6ee1\u5371\u673a\uff0c\u56db\u5904\u6b8b\u8d25\uff0c\u4e00\u7247\u672b\u4e16\u666f\u8c61\u30029\u53f7\u5e26\u7740\u4e00\u4e2a\u753b\u6709\u4e09\u4e2a\u5947\u602a\u7b26\u53f7\u7684\u5706\u5f62\u7269\u4f53\u9003\u5230\u8857\u4e0a\uff0c\u5e78\u9047\u53d1\u660e\u5bb6\u673a\u5668\u4eba2\u53f7\uff08\u9a6c\u4e01\u2022\u5170\u9053 Martin Landau \u9970\uff09\u7ed9\u81ea\u5df1\u88c5\u4e0a\u4e86\u58f0\u97f3\uff0c\u4f462\u53f7\u5374\u4e0d\u5e78\u88ab\u673a\u5668\u602a\u517d\u6293\u8d70\u30029\u53f7\u627e\u5230\u4e86\u8001\u51751\u53f7\uff08\u514b\u91cc\u65af\u6258\u5f17\u2022\u666e\u5362\u9ed8 Christopher Plummer \u9970\uff09\u3001\u673a\u68b0\u5de55\u53f7\uff08\u7ea6\u7ff0\u2022\u96f7\u5229 John C. Reilly \u9970\uff09\u3001\u75af\u766b\u753b\u5bb66\u53f7\uff08\u514b\u91cc\u65af\u54c1\u2022\u683c\u62c9\u592b Crispin Glover \u9970\uff09\u548c\u5927\u529b\u58eb8\u53f7\uff08\u5f17\u96f7\u5fb7\u2022\u5854\u5854\u7ecd\u5c14 Fred Tatasciore \u9970\uff09\u30029\u53f7\u4e0e5\u53f7\u64c5\u81ea\u51fa\u884c\u63f4\u65512\u53f7\uff0c\u5371\u6025\u65f6\u88ab\u5973\u6b66\u58eb7\u53f7\uff08\u8a79\u59ae\u4f5b\u2022\u5eb7\u7eb3\u5229 Jennifer Connelly \u9970\uff09\u6551\u4e0b\uff0c\u4f46\u65e0\u610f\u4e2d9\u53f7\u5374\u4ee4\u7ec8\u6781\u673a\u5668\u517d\u590d\u6d3b\u3002\u5e26\u7740\u81ea\u5df1\u4ece\u54ea\u91cc\u6765\u4ee5\u53ca\u751f\u5b58\u4f7f\u547d\u7684\u95ee\u9898\uff0c9\u53f7\u51b3\u5b9a\u60f3\u5c3d\u529e\u6cd5\u5236\u670d\u673a\u5668\u517d\uff0c\u62ef\u6551\u5168\u4e16\u754c\u2026\u2026\u00a9\u8c46\u74e3",
	"subtype": "movie",
	"directors": [{
		"alt": "https:\/\/movie.douban.com\/celebrity\/1276787\/",
		"avatars": {
			"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1351678808.44.webp",
			"large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1351678808.44.webp",
			"medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1351678808.44.webp"
		},
		"name": "\u7533\u00b7\u963f\u514b",
		"id": "1276787"
	}],
	"comments_count": 9099,
	"ratings_count": 59849,
	"aka": ["9\uff1a\u672b\u4e16\u51b3\u6218", "\u4e5d", "Number 9", "\u673a\u5668\u4eba9\u53f7"]
}*/