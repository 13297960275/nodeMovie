var mongoose = require('mongoose');
var commentSchema = require('../schemas/commentService');
var comment = mongoose.model('comment',commentSchema);

module.exports = comment;