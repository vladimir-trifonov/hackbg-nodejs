var should = require('should'),
	assert = require('assert'),
	request = require('supertest'),
	mongoose = require('mongoose'),
	config = require('./config-debug');

describe('Routing', function() {
	var url = 'http://localhost:8020';

	before(function(done) {
		mongoose.connect(config.db.mongodb);
		done();
	});

	describe('Contact', function() {
		it('should return error trying to save contact without person identifier', function(done) {
			var userContact = {
				phoneNumber: '453465457565'
			};

			request(url)
				.post('/api/contacts')
				.send(userContact)
				.expect(400)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					done();
				});
		});
		it('should correctly add new contact', function(done) {
			var userContact = {
				phoneNumber: '453465457565',
				personIdentifier: "Ivan Ivanov Petrov"
			};
			request(url)
				.post('/api/contacts')
				.send(userContact)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.have.property('success');
					res.body.msg.should.equal('Contact saved!');
					done();
				});
		});
	});
});