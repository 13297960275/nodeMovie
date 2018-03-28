var Log = require('../models/log');


/*admin log list page*/
exports.getLogs = function(req, res) {
	Log.fetch(function(err, logs) {
		if (err) {
			console.log(err);
		}

		res.render('logList', {
			title: 'log list',
			logs: logs
		})
	})
}

/*admin save log fun*/
exports.saveLogFun = function(req, res) {
	// console.log('saveLogFun');
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
}