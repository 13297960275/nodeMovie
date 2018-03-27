var mongoose = require('mongoose');
var logSchema = require('../schemas/log');
var log = mongoose.model('log',logSchema);

module.exports = log;