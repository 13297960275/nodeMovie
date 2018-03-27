var mongoose = require('mongoose');
var logSchema = require('../schemas/logService');
var log = mongoose.model('log',logSchema);

module.exports = log;