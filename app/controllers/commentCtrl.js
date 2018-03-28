var Comment = require('../models/comment');

exports.addComment = function(req, res) {
	var _comment = req.body.comment;
	console.log('_comment == ' + JSON.stringify(_comment));
	var movieId = _comment.movie;
	var comment = new Comment({
		_comment
	});

	comment.save(function(err, comment) {
		if (err) {
			console.log(err);
		}
		console.log('comment == ' + JSON.stringify(comment));

		res.redirect('/movie/' + movieId);
	})
}