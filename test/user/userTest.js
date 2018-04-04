var crypto = require('crypto');
var bcrypt = require('bcrypt');

function getRandomString(len) {
	if (!len) len = 16;

	return crypto.randomBytes(Math.ceil(len / 2));
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
// var User = require('../../app/model/user');
var User = mongoose.model('user');

var user;

// test
describe('Unit Test', function() {
	describe('Model Users', function() {
		before(function(done) {
			user = {
				name: getRandomString(),
				password: 'password'
			};

			done();
		});

		describe('before Method save', function() {
			it('should begin without test user', function(done) {
				User.find({
					name: user.name
				}, function(err, users) {
					users.should.have.length(0);

					done();
				});
			});
		});

		describe('User save', function() {
			it('should save without errors', function(done) {
				var _user = new User(user);
				_user.save(function(err) {
					should.not.exist(err);
					_user.remove(function(err) {
						should.not.exist(err);
						done();
					});
				});
			});

			it('should password be hashed carrectly', function(done) {
				var password = user.password;
				var _user = new User(user);
				_user.save(function(err) {
					should.not.exist(err);
					_user.password.should.not.have.length(0);

					bcrypt.compare(password, _user.password, function(err) {
						should.not.exist(err);
						_user.remove(function(err) {
							should.not.exist(err);
							done();
						});
					});
				});
			});

			it('should have default role 0', function(done) {
				var _user = new User(user);
				_user.save(function(err) {
					should.not.exist(err);
					_user.role.should.equal(0);

					_user.remove(function(err) {
						should.not.exist(err);
						done();
					});
				});
			});

			it('should user name is not exist', function(done) {
				var _user1 = new User(user);
				_user1.save(function(err) {
					should.not.exist(err);

					var _user = new User(user);
					_user.save(function(err) {
						should.exist(err);

						_user.remove(function(err) {
							if (!err) {
								_user.remove(function(err) {
									done();
								});
							}
						});
					});
				});

			});
		});

		after(function(done) {
			console.log('after');
			done();
		});
	});
});