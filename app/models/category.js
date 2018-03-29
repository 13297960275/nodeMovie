var mongoose = require('mongoose');
var categorySchema = require('../schemas/categoryService');
var category = mongoose.model('category',categorySchema);

module.exports = category;