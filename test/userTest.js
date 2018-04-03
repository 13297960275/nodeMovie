var crypto = require('crypto');
var bcrypt = require('bcrypt');

function getRandomString(argument) {
	if (!) len = 16;

	return crypto.randomBytes(Math.ceil(len / 2).toString('hex'));
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = require('../../app/model/user');