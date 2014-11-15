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
				},
				contact_id = null;

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
		it('should  correctly return added contact', function(done) {
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

					request(url)
						.get('/api/contacts/' + res.body.contact_id)
						.expect(200)
						.end(function(err, res) {
							if (err) {
								throw err;
							}

							res.body.data.should.have.property('phoneNumber');
							res.body.data.should.have.property('personIdentifier');
							res.body.data.personIdentifier.should.equal('Ivan Ivanov Petrov');
							done();
						});
				});
		});
		it('should delete contact', function(done) {
			var userContact = {
				phoneNumber: '4534657565',
				personIdentifier: "Ivan Petrov Ivanov"
			};
			request(url)
				.post('/api/contacts')
				.send(userContact)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					var contact_id = res.body.contact_id;
					request(url)
						.delete('/api/contacts/' + contact_id)
						.end(function(err, res) {
							if (err) {
								throw err;
							}

							request(url)
								.get('/api/contacts/' + contact_id)
								.end(function(err, res) {
									if (err) {
										throw err;
									}

									res.body.should.have.property('success');
									res.body.success.should.equal(true);
									should(res.body.data).not.be.ok;
									done();
								});
						});
				});
		});
	});
});