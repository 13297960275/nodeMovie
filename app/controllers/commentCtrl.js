var Comment = require('../models/comment');

exports.addComment = function(req, res) {
	var _comment = req.body.comment;
	console.log('_comment == ' + JSON.stringify(_comment));
	var movieId = _comment.movie;

	if (_comment.cid) {// 回复评论
		Comment.findById(_comment.cid, function(err, comment) {
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			// console.log('comment reply == ' + JSON.stringify(comment.reply));


			comment.reply.push(reply);

			comment.save(function(err, comment) {
				if (err) {
					console.log(err);
				}
				// console.log('comment reply == ' + JSON.stringify(comment));

				res.redirect('/movie/' + movieId);
			});
		});
	} else {// 评论

		// var comment = new Comment({
		// 	movie: _comment.movie,
		// 	from: _comment.from,
		// 	to: _comment.to,
		// 	reply: _comment.reply.push({
		// 		from: _comment.from,
		// 		to: _comment.to,
		// 		content: _comment.content
		// 	}),
		// 	content: _comment.content,
		// });

		var comment = new Comment(_comment);

		// console.log('comment sch == ' + JSON.stringify(comment));

		comment.save(function(err, comment) {
			if (err) {
				console.log(err);
			}
			// console.log('comment == ' + JSON.stringify(comment));

			res.redirect('/movie/' + movieId);
		});
	}
};