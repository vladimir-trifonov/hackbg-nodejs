var Q = require('q');

module.exports = {
	addConfirmation: function() {
		var defer = Q.defer(),
			id = random.getRandomString(12);

		return defer.promise;
	},
	checkIsConfirmed: function(mail, storage) {
		var defer = Q.defer(),
			mailsColl = storage.getItem('mails') || {};

		if(mailsColl[mail] === true) {
			defer.resolve();
		} else {
			defer.reject();
		}
		return defer.promise;
	},
	setNotConfirmed: function(mail, storage) {
		var defer = Q.defer(),
			mailsColl = storage.getItem('mails') || {};

		mailsColl[mail] = false;
		storage.setItem('mails', mailsColl);

		defer.resolve();
		return defer.promise;
	},
	setConfirmed: function(mail, storage) {
		var defer = Q.defer(),
			mailsColl = storage.getItem('mails') || {};

		mailsColl[mail] = true;
		storage.setItem('mails', mailsColl);

		defer.resolve();
		return defer.promise;
	}
}
