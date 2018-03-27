var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = process.env.PORT || 9000;
var app = express();
var dbUrl = 'mongodb://localhost/movie';

mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'movie',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pertty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));

console.log('Server start on ' + port);