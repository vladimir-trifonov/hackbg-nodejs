var Mail = require('../data/Mail'),	
	Q = require('q');

module.exports = {
	sendMails: sendMails
};

function sendMails(data) {
	var emails = [],
		deferred = Q.defer();

	emails = Object.keys(data);
	Mail.sendMail({
		"deferred": deferred,
		"emails": emails,
		"emailsTexts": data,
		"errors": []
	});

	return deferred.promise;
};

