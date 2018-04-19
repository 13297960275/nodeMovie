var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var formidable = require('formidable');
var serveStatic = require('serve-static');
var port = process.env.PORT || 9000;
var app = express();
var dbUrl = 'mongodb://localhost/movie';

mongoose.connect(dbUrl);

/* model loading*/
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);

			if (stat.isfile()) {
				if (/(.w)\.(js|coffee)/.test(file)) {
					require(newPath);
				}
			} else if (stat.isDirectory()) {
				walk(newPath);
			}
		});
}

// 视图路径及解析模板
app.set('views', './app/views/pages');
app.set('view engine', 'jade');

// handle request entity too large
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

// session及session持久化
app.use(session({
	secret: 'movie',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

// Dev环境http请求、数据库操作等log
// var env = process.env.NODE_ENV || 'development';
// if ('development' === env) {
// 	app.set('showStackError', true);
// 	app.use(logger(':method :url :status'));
// 	app.locals.pertty = true;
// 	mongoose.set('debug', true);
// }

app.listen(port);
app.locals.moment = require('moment');
app.use(serveStatic(path.join(__dirname, 'public')));

require('./config/routes')(app);

console.log('Server start on ' + port);