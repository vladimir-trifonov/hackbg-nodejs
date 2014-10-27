var random = require('../common/random'),
	Q = require('q');

module.exports = {
	addConfirmation: function(mail, storage) {
		var defer = Q.defer(),
			confirmationKey = random.getRandomString(12),
			confirmationsColl = storage.getItem('confirmations') || {};

		confirmationsColl[confirmationKey] = mail;
		storage.setItem('confirmations', confirmationsColl);

		defer.resolve(confirmationKey);
		return defer.promise;
	},
	getMailByKey: function(confirmationKey, storage) {
		var defer = Q.defer(),
			confirmationsColl = storage.getItem('confirmations') || {};

		defer.resolve(confirmationsColl[confirmationKey]);
		return defer.promise;
	}
}