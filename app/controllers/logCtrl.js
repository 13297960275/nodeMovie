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