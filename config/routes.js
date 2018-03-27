var indexCtrl = require('../app/controllers/indexCtrl');
var movieCtrl = require('../app/controllers/movieCtrl');
var userCtrl = require('../app/controllers/userCtrl');
var logCtrl = require('../app/controllers/logCtrl');
var _ = require('underscore');
var Log = require('../app/models/log');

module.exports = function(app) {

	// pre handler user
	app.use(function(req, res, next) {
		// console.log('pre req.path==' + req.path);
		// console.log('pre req.ip==' + req.ip);

		var log = new Log({
			path: req.path,
			ip: req.ip
		})
		log.save(function(err, log) {
			if (err) {
				console.log(err);
			}
		})

		// console.log('pre session==' + JSON.stringify(req.session.user));

		var _user = req.session.user;
		// if (_user) {
			app.locals.user = _user;
		// }
		return next();
	})

	//  index page
	app.get('/', indexCtrl.index);

	//  movie detail page
	app.get('/movie/:id', movieCtrl.movieDetail);

	/*movie module page*/

	//  admin movie list page
	app.get('/admin/movie/list', movieCtrl.getMovies);

	// admin update movie page
	app.get('/admin/movie/:id', movieCtrl.editMovie);

	//  admin add movie page
	app.get('/admin/movie', movieCtrl.addMovie);

	/*movie module fun*/

	//  admin update movie func
	app.post('/admin/movie/edit/:id', movieCtrl.editMovieFun);

	// admin add movie fun
	app.post('/admin/movie/add', movieCtrl.addMovieFun);

	//  admin delete movie fun
	app.delete('/admin/movie/del', movieCtrl.delMovieFun);

	/*user module page*/

	//  admin user list page
	app.get('/admin/user/list', userCtrl.getUsers);

	/*user module fun*/

	// user sign up fun
	app.post('/admin/user/signup', userCtrl.signUpFun);

	// user sign up
	app.post('/admin/user/signin', userCtrl.signInFun);

	//  admin delete user fun
	app.delete('/admin/user/del', userCtrl.delUserFun);

	//  admin user signout fun
	app.get('/admin/user/signout', userCtrl.signOutFun);

	/*admin log list page*/
	app.get('/admin/log/list', logCtrl.getLogs);

}