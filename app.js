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


app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

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

// var formidable = require('formidable'),
// 	http = require('http'),
// 	util = require('util');

// http.createServer(function(req, res) {
// 	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
// 		console.log('upload1');
// 		//Creates a new incoming form.
// 		var form = new formidable.IncomingForm();
// 		//设置文件上传存放地址
// 		// form.uploadDir = __dirname + '/public/upload/poster/';
// 		//执行里面的回调函数的时候，表单已经全部接收完毕了。
// 		form.parse(req, function(err, fields, files) {
// 			console.log('files == ' + JSON.stringify(files));
// 			//使用第三方模块silly-datetime
// 			var t = new Date();
// 			//生成随机数
// 			var ran = parseInt(Math.random() * 8999 + 10000);
// 			//拿到扩展名
// 			var extname = path.extname(files.uploadPoster.name);
// 			//旧的路径
// 			var oldpath = files.uploadPoster.path;
// 			//新的路径
// 			var newpath = __dirname + '\\public\\upload\\poster\\' + ran + extname;
// 			console.log(oldpath + '====' + newpath)
// 			//改名
// 			fs.rename(oldpath, newpath, function(err) {
// 				if (err) {
// 					throw Error("改名失败");
// 				}
// 				console.log('rename')
// 			});
// 		});

// 		// 事件
// 		// progress事件在接收到每一个解析的数据块后触发。 可以根据该事件更新进度条
// 		// form.on('progress', function(bytesReceived, bytesExpected) {});

// 		// field时间在接收到一个字段键值对的时候触发
// 		// form.on('field', function(name, value) {});

// 		// fileBegin事件在一个新文件开始上传时触发， 如果想改变文件上传的路径， 可以在该事件内定义。
// 		form.on('fileBegin', function(name, file) {
// 			console.log('===fileBegin===')
// 		});

// 		// file事件在接收到一个文件字段值是触发。 file是File的实例
// 		// form.on('file', function(name, file) {});

// 		// error在接收form表单提交的数据发生错误时触发。 如果请求过程中有错误， 该请求将会自动终止。 但是如果你想继续发送请求， 可以使用request.resume() 方法。
// 		// form.on('error', function(err) {});

// 		// ‘ aborted’ 事件是当用户中止请求时触发， 上传时间超时或者通过socket关闭事件也可以触发该事件。 该事件触发后， 将会随着触发error时间
// 		// form.on('aborted', function() {});

// 		// ‘ end’ 时间在请求完全接收后触发， 即文件已被成功存入磁盘。 通过该事件可以发送响应
// 		form.on('end', function() {
// 			console.log('===end===')
// 		});
// 	}

// 	// show a file upload form
// 	res.writeHead(200, {
// 		'content-type': 'text/html'
// 	});
// 	res.end(
// 		'<form action="/upload" enctype="multipart/form-data" method="post">' +
// 		'<input type="text" name="title"><br>' +
// 		'<input type="file" name="uploadPoster" multiple="multiple"><br>' +
// 		'<input type="submit" value="Upload">' +
// 		'</form>'
// 	);
// }).listen(port);