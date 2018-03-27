var mongoose = require('mongoose');
var movieSchema = require('../schemas/movieService');
var movie = mongoose.model('movie',movieSchema);

module.exports = movie;