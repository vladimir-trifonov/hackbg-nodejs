var should = require('should'),
	assert = require('assert'),
	request = require('supertest');

describe('User', function() {
	var url = 'http://localhost:8700';

	describe('Create User', function() {
		it('should create new user', function(done) {
			var user = {
				username: 'test',
				password: 'test'
			};

			request(url)
				.post('/api/users')
				.send(user)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.have.property('username');
					res.body.username.should.equal('test');

					done();
				});
		});
	});
});