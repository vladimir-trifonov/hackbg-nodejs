var nodemailer = require('nodemailer'),
	Mail = require('../data/Mail'),
	config = require('../configs/config'),
	transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: config.nodemailer.auth
	}),
	mailDefaultOptions = config.nodemailer.defaultOptions;

module.exports = {
	sendMails: sendMails
};

function sendMails(data) {
	var emails = [],
		deferred = Q.defer();

	emails = Object.keys(data);
	sendMails({
		"deferred": deferred,
		"emails": emails,
		"emailsTexts": data,
		"errors": []
	});

	return deferred.promise;
};

function sendMail(options) {
	var deferred = options.deferred,
		errors = options.errors;
	if (emails.length > 0) {
		var mail = options.emails.shift();

		var mailReceiverOptions = {
			to: mail
		}

		for (var property in mailDefaultOptions) {
			if (mailDefaultOptions.hasOwnProperty(property)) {
				mailReceiverOptions[property] = mailDefaultOptions[property];
			}
		}

		mailReceiverOptions['html'] = JSON.stringify(options.emailsTexts[mail]);

		transporter.sendMail(mailReceiverOptions, function(err, info) {
			if (err) {
				errors.push(err);
			}

			sendMail(options);
		});
	} else {
		if(errors.length > 0) {
			deferred.reject(errors);
		} else {
			deferred.resolve();
		}
	}
};