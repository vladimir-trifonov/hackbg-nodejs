var sanitize = require('mongo-sanitize'),
	Levenshtein = require('levenshtein'),
	Contact = require('mongoose').model('Contact'),
	Q = require('q');

module.exports = {
	addContact: function(req, res, next) {
		var data = req.body;

		if(!data.personIdentifier || !data.phoneNumber) {
			res.status(400);
			res.end();
			return;
		}

		var cw = data.personIdentifier.split(' '),
		newContact = new Contact({
			phoneNumber: data.phoneNumber,
			cw: cw
		});

		newContact.save(function(err, contact) {
			if (err) {
				return next(new Error('Contact could not be saved!'));
			}

			res.json({
				success: true,
				msg: 'Contact saved!',
				contact_id: contact.id
			});

			res.locals.contact = contact;
			next();
		});
	},
	getContact: function(req, res, next) {
		var id = null;

		if(!req.params.contact_id) {
			res.status(400);
			res.end();
			return;
		}

		id = sanitize(req.params.contact_id);

		Contact.findOne({
				_id: id
			},
			function(err, contact) {
				if (err) {
					return next(new Error('Contact could not be loaded!'));
				}

				var result = null;
				if (contact !== null) {
					result = {
						id: contact.id,
						phoneNumber: contact.phoneNumber,
						personIdentifier: contact.personIdentifier
					}
				}

				res.json({
					success: true,
					data: result
				});

				next();
			});
	},
	getAllContacts: function(req, res, next) {
		Contact.find({}, function(err, collection) {
			if (err) {
				return next(new Error('Contacts could not be loaded!'));
			}

			if (collection !== null) {
				collection = collection.map(function(contact) {
					return {
						id: contact.id,
						phoneNumber: contact.phoneNumber,
						personIdentifier: contact.personIdentifier
					}
				});
			}

			res.json({
				success: true,
				data: collection
			});

			next();
		});
	},
	removeContact: function(req, res, next) {
		var id = null;

		if(!req.params.contact_id) {
			res.status(400);
			res.end();
			return;
		}

		id = sanitize(req.params.contact_id);

		Contact.remove({
			_id: id
		}, function(err) {
			if (err) {
				return next(new Error('Contact could not be deleted!'));
			}

			res.json({
				success: true,
				msg: 'Contact deleted!'
			});
			next();
		});
	},
	removeAll: function(req, res, next) {
		Contact.remove({}, function(err) {
			if (err) {
				return next(new Error('Contacts could not be deleted!'));
			}

			res.json({
				success: true,
				msg: 'Contacts deleted!'
			});
			next();
		});
	},
	getOtherCommonWords: function(contact, contactCommonWords) {
		var deferred = Q.defer(),
			otherCommonWords = [],
			fuzzyGroups = {};

		contact.getOtherCommonWords().then(function(cw) {
			cw.forEach(function(word) {
				contactCommonWords.forEach(function(contactWord) {
					if (new Levenshtein(contactWord, word).distance === 1) {
						otherCommonWords.push(word);
						if (!fuzzyGroups[contactWord]) {
							fuzzyGroups[contactWord] = [];
						}
						fuzzyGroups[contactWord].push(word);
					}
				})
			});

			deferred.resolve({
				"otherCommonWords": otherCommonWords,
				"fuzzyGroups": fuzzyGroups
			});
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise;
	},
	commonWordsToGroups: function(contact, otherCommonWords) {
		return contact.commonWordsToGroups(otherCommonWords);
	}
};