var nodemailer = require('nodemailer'),
	Mail = require('../models/Mail'),
	Confirm = require('../models/Confirm'),
	config = require('../configs/config'),
	transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: config.nodemailer.auth
	}),
	mailDefaultOptions = config.nodemailer.defaultOptions;

module.exports = {
	sendConfirmation: sendConfirmation,
	confirm: confirm
};

function sendConfirmation(req, res, next) {
	var mail = req.body.email,
		storage = req.storage;

	Mail.checkIsConfirmed(mail, storage)
		.then(
			function() {
				next();
			},
			function() {
				Mail.setNotConfirmed(mail, storage)
					.done(function() {
						next();
					});

				var mailReceiverOptions = {
					to: mail
				}

				for (var property in mailDefaultOptions) {
					if (mailDefaultOptions.hasOwnProperty(property)) {
						mailReceiverOptions[property] = mailDefaultOptions[property];
					}
				}

				Confirm.addConfirmation(mail, storage).then(function(confirmationKey) {
					var link = config.url + ":" + config.port + "/confirm/" + confirmationKey;

					mailReceiverOptions['html'] =
						"<p>Confirmation&nbsp;link(please type this address in browser):&nbsp;<span style='font-weight: bold;'>" +
						link +
						"</span></p>";

					transporter.sendMail(mailReceiverOptions, function(error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Message sent: ' + info.response);
						}
					});
				})
			}
		);
};

function confirm(req, res, next) {
	var key = req.params.key,
		storage = req.storage;

	Confirm.getMailByKey(key, storage).then(function(mail) {
		Mail.setConfirmed(mail, storage).done(function() {
			next();
		});
	});
	res.end();
};