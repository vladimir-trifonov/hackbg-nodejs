var Subscriber = require("../models/Subscriber"),
	filesHelper = require('../common/filesHelper'),
	Q = require('q'),
	subscribersFilePath = '../subscribers.json',
	emailsPath = '../emails.json';

module.exports = {
	listSubscribers: listSubscribers,
	saveAllDataToFiles: saveAllDataToFiles,
	saveConfirmedEmailsToFile: saveConfirmedEmailsToFile
};

function listSubscribers(req, res, next) {
	Subscriber.getAllSubscribes(req.storage).then(function(data) {
		res.send(JSON.stringify(data));
		next();
	}, function(err) {
		console.log("Error: " + err);
		res.send(500);
		next();
	});
};

function saveAllDataToFiles(req, res, next) {
	var storage = req.storage,
		subscribersColl = storage.getItem('subscribers') || {},
		emailsColl = storage.getItem('mails') || {};


	filesHelper.saveDataToFile(subscribersFilePath, JSON.stringify(subscribersColl), function(err) {
		if (err) {
			return console.log(err);
		}

		filesHelper.saveDataToFile(emailsPath, JSON.stringify(emailsColl), function(err) {
			if (err) {
				return console.log(err);
			}

			next();
		})
	});
};

function saveConfirmedEmailsToFile(req, res, next) {
	var storage = req.storage,
		emailsColl = storage.getItem('mails') || {};

	filesHelper.saveDataToFile(emailsPath, JSON.stringify(emailsColl), function(err) {
		if (err) {
			return console.log(err);
		}

		next();
	})
};