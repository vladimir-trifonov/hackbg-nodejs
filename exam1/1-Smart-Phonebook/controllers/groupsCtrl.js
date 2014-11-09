var sanitize = require('mongo-sanitize'),
	Group = require('mongoose').model('Group'),
	contactsCtrl = require('./contactsCtrl'),
	mongoose = require('mongoose'),
	async = require('async');
utils = require('../common/utils');

module.exports = {
	checkAddGroup: function(req, res) {
		var contact = res.locals.contact;

		var contactCommonWords = contact.cw.join(' ').toLowerCase().split(' '),
			contactId = contact.id;

		contactsCtrl.getOtherCommonWords(contact, contactCommonWords).then(function(data) {
				var otherCommonWords = data.otherCommonWords,
					fuzzyGroups = data.fuzzyGroups;

				contactsCtrl.commonWordsToGroups(contact, otherCommonWords)
					.then(function(collection) {
							var calls = [];

							collection.forEach(function(groupObj) {
								if (contactCommonWords.indexOf(groupObj._id) !== -1 && groupObj.count > 1) {
									calls.push(function() {
								        createOrAddToGroup({
											"groupObj": groupObj,
											"contactId": contactId
										});
								    });
								}
							});

							Object.keys(fuzzyGroups).forEach(function(contactWord) {
								var fuzzyGroup = fuzzyGroups[contactWord];
								calls.push(function() {
							        createOrAddToFuzzyGroup({
										"contactWord": contactWord,
										"fuzzyGroup": fuzzyGroup,
										"collection": collection,
										"contactId": contactId
									});
							    });
							});

							async.parallel(calls, function(err) {
							    if (err) {
							        return console.log(err);
							    }
							});

						},
						function(err) {
							console.log(err);
						});
			},
			function(err) {
				console.log(err);
			});
	},
	removeAll: function(req, res, next) {
		Group.remove({}, function(err) {
			if (err) {
				return next(new Error('Groups could not be deleted!'));
			}

			next();
		});
	},
};

function createOrAddToGroup(data) {
	var groupName = utils.capitaliseFirstLetter(data.groupObj._id);

	Group.findOne({
		groupName: groupName
	}, function(err, group) {
		if (err) {
			return console.log('Group could not be find!');
		}

		if (group) {
			Group.update({
				groupName: groupName
			}, {
				$addToSet: {
					contacts: data.contactId
				}
			}, {
				upsert: true
			}, function(err) {
				if (err) {
					return console.log('Group could not be updated!');
				}
			})
		} else {
			var	newGroup = new Group({
					"groupName": groupName,
					contacts: data.groupObj.contactIds
				});

			newGroup.markModified('groupName');
			newGroup.save(function(err, group) {
				if (err) {
					return console.log('Group could not be created!');
				}
			});
		}
	});
};

function createOrAddToFuzzyGroup(data) {
	var fuzzyGroup = data.fuzzyGroup.map(function(fuzzyGroupName) {
		return utils.capitaliseFirstLetter(fuzzyGroupName);
	});

	Group.findOne({
		groupName: { $all: fuzzyGroup }
	}, function(err, group) {
		if (err) {
			return console.log('Group could not be find!');
		}

		if (group) {
			Group.update({
				_id: group.id
			}, {
				$addToSet: {
					contacts: data.contactId
				}
			}, {
				upsert: true
			}, function(err) {
				if (err) {
					return console.log('Fuzzy group could not be updated!');
				}
			})
		} else {
			data.fuzzyGroup.push(data.contactWord);

			var	fuzzyGroup = data.fuzzyGroup.map(function(fuzzyGroupName) {
				return utils.capitaliseFirstLetter(fuzzyGroupName);
			});

			var contactIds = [];
			collection.forEach(function(groupObj) {
				if(fuzzyGroup.indexOf(groupObj._id) !== -1) {
					contactIds = contactIds.concat(groupObj.contactIds);
				}
			})

			var	newGroup = new Group({
					"groupName": fuzzyGroup,
					type: 'fuzzy',
					contacts: contactIds
				});

			newGroup.markModified('groupName');
			newGroup.save(function(err, group) {
				if (err) {
					return console.log('Group could not be created!');
				}
			});
		}
	});
};