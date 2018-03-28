var User = require('../models/user');

/*user module page*/

//  admin user list page
exports.getUsers = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}

		res.render('user/userList', {
			title: 'user list',
			users: users
		})
	})
}

//  admin user list page
exports.signIn = function(req, res) {
	res.render('user/signIn', {
		title: 'user signIn'
	})
}

//  admin user list page
exports.signUp = function(req, res) {
	res.render('user/signUp', {
		title: 'user signUp'
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
			// 已有账号，重定向到登录页
			return res.redirect('/admin/user/signin');
		} else {
			// console.log('find:user====' + JSON.stringify(user));
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				} else {
					// console.log('save:user====' + user.name);
					req.session.user = user;

					res.redirect('/');
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
			// 没有账号，重定向到注册页
			return res.redirect('/admin/user/signup');
		}

		user.comparePassword(_user.password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				// console.log('password is matched');

				req.session.user = user;
				// console.log('signInFun session==' + JSON.stringify(req.session.user));

				return res.redirect('/');
			} else {
				// console.log('password is not matched')
				// 密码不匹配，重定向到登录页
				res.redirect('/admin/user/signin');
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

// permission control middleware

// 登录验证
exports.userSignInRequired = function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		// 用户未登录
		console.log('userSignInRequired session.user == ' + JSON.stringify(req.session.user));
		return res.redirect('/admin/user/signin');
	}

	next();
}

// 管理员角色验证
exports.userAdminRequired = function(req, res, next) {
	var user = req.session.user;
	if (user.role <= 10) {
		// 普通用户
		console.log('userAdminRequired session.user == ' + JSON.stringify(req.session.user));
		return res.redirect('/admin/user/signin');
	}

	next();
}