var User = require('../models/user');

/*user module page*/

//  admin user list page
exports.getUsers = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userList', {
			title: 'user list',
			users: users
		})
	})
}

/*user module fun*/

// user sign up fun
exports.signUpFun = function(req, res) {
	var _user = req.body.user;
	// var _user = req.param('user');
	// var _user = req.params.user;
	// console.log('signup:_user====' + _user.name);
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
			// console.log('find:!user====' + JSON.stringify(user));
			return res.redirect('/');
		} else {
			// console.log('find:user====' + JSON.stringify(user));
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				} else {
					// console.log('save:user====' + user.name);
					res.redirect('/admin/user/list');
				}
			})
		}
	})
}

// user sign up
exports.signInFun = function(req, res) {
	var _user = req.body.user;
	// console.log('signin:_user====' + _user.name);

	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			// console.log('find:user====' + user);
			return res.redirect('/');
		}

		user.comparePassword(_user.password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				// console.log('password is matched');

				req.session.user = user;
				return res.redirect('/');
			} else {
				// console.log('password is not matched')
				res.redirect('/admin/user/list');
			}
		})
	})
}

//  admin delete user fun
exports.delUserFun = function(req, res) {
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
}

//  admin user signout fun
exports.signOutFun = function(req, res) {
	delete req.session.user;
	// delete app.locals.user;

	res.redirect('/');
}