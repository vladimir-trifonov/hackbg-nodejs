var nodemailer = require('nodemailer'),
	config = require('../configs/config'),
	mailDefaultOptions = config.nodemailer.defaultOptions,
	transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: config.nodemailer.auth
	});

module.exports = {
	sendMail: sendMail
};

function sendMail(options) {
	var deferred = options.deferred,
		errors = options.errors,
		emails = options.emails,
		emailsTexts = options.emailsTexts;

	if (emails.length > 0) {
		var mail = emails.shift();

		var mailReceiverOptions = {
			to: mail
		}

		for (var property in mailDefaultOptions) {
			if (mailDefaultOptions.hasOwnProperty(property)) {
				mailReceiverOptions[property] = mailDefaultOptions[property];
			}
		}

		mailReceiverOptions['html'] = JSON.stringify(emailsTexts[mail]);

		transporter.sendMail(mailReceiverOptions, function(err, info) {
			if (err) {
				errors.push(err);
			}
			console.log("Mail sended!");
			sendMail(options);
		});
	} else {
		if (errors.length > 0) {
			deferred.reject(errors);
		} else {
			deferred.resolve();
		}
	}
};