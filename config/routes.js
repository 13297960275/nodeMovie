var indexCtrl = require('../app/controllers/indexCtrl');
var movieCtrl = require('../app/controllers/movieCtrl');
var userCtrl = require('../app/controllers/userCtrl');
var logCtrl = require('../app/controllers/logCtrl');
var commentCtrl = require('../app/controllers/commentCtrl');
var categoryCtrl = require('../app/controllers/categoryCtrl');

var multiparty = require('connect-multiparty');
var multipart = multiparty();

var _ = require('underscore');

module.exports = function(app) {

	// pre handler user
	app.use(function(req, res, next) {
		// console.log('pre req.path==' + req.path);
		// console.log('pre req.ip==' + req.ip);
		logCtrl.saveLogFun(req, res);

		// console.log('pre session==' + JSON.stringify(req.session.user));

		var _user = req.session.user;
		if (_user) {
			app.locals.user = _user;
		}
		return next();
	})

	//  index page
	app.get('/', indexCtrl.index);

	//  movie detail page
	app.get('/movie/:id', movieCtrl.movieDetail);

	/*movie module page*/

	//  admin movie list page
	app.get('/admin/movie/list', userCtrl.userSignInRequired, userCtrl.userAdminRequired, movieCtrl.getMovies);

	// admin update movie page
	app.get('/admin/movie/:id', userCtrl.userSignInRequired, userCtrl.userAdminRequired, movieCtrl.editMovie);

	//  admin add movie page
	app.get('/admin/movie', userCtrl.userSignInRequired, userCtrl.userAdminRequired, movieCtrl.addMovie);

	/*movie module fun*/

	//  admin update movie func
	app.post('/admin/movie/edit/:id', userCtrl.userSignInRequired, userCtrl.userAdminRequired, movieCtrl.editMovieFun);

	// admin add movie fun
	app.post('/admin/movie/add', userCtrl.userSignInRequired, userCtrl.userAdminRequired, multipart, movieCtrl.uploadPoster, movieCtrl.addMovieFun);

	//  admin delete movie fun
	app.delete('/admin/movie/del', userCtrl.userSignInRequired, userCtrl.userAdminRequired, movieCtrl.delMovieFun);

	/*user module page*/

	//  admin user list page
	app.get('/admin/user/list', userCtrl.userSignInRequired, userCtrl.userAdminRequired, userCtrl.getUsers);

	// user sign up fun
	app.get('/admin/user/signup', userCtrl.signUp);

	// user sign up
	app.get('/admin/user/signin', userCtrl.signIn);

	/*user module fun*/

	// user sign up fun
	app.post('/admin/user/signup', userCtrl.signUpFun);

	// user sign up
	app.post('/admin/user/signin', userCtrl.signInFun);

	//  admin delete user fun
	app.delete('/admin/user/del', userCtrl.userSignInRequired, userCtrl.userAdminRequired, userCtrl.delUserFun);

	//  admin user signout fun
	app.get('/admin/user/signout', function(req, res) {
		delete app.locals.user;

		userCtrl.signOutFun(req, res);
	});

	/*admin log list page*/
	app.get('/admin/log/list', userCtrl.userSignInRequired, userCtrl.userAdminRequired, logCtrl.getLogs);

	/* comment */
	app.post('/admin/comment', userCtrl.userSignInRequired, commentCtrl.addComment);

	/* add category page*/
	app.get('/admin/category/add', userCtrl.userSignInRequired, userCtrl.userAdminRequired, categoryCtrl.addCategory);

	/* category list page*/
	app.get('/admin/category/list', userCtrl.userSignInRequired, userCtrl.userAdminRequired, categoryCtrl.getCategories);

	/* add category fun*/
	app.post('/admin/category/add', userCtrl.userSignInRequired, userCtrl.userAdminRequired, categoryCtrl.addCategoryFun);

	/* delete category fun*/
	app.delete('/admin/category/del', userCtrl.userSignInRequired, userCtrl.userAdminRequired, categoryCtrl.delCategoryFun);

	/* get category by page fun*/
	app.get('/search', indexCtrl.getCategoryBypage);
}