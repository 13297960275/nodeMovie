var mongoose = require('mongoose');
var userSchema = require('../schemas/userService');
var user = mongoose.model('user',userSchema);

module.exports = user;