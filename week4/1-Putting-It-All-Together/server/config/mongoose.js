var mongoose = require('mongoose'),
	snippet = require('../models/Snippet'),
	user = require('../models/User');

module.exports = function(config) {
	mongoose.connect(config.db);
	var db = mongoose.connection;

	db.once('open', function(err) {
		if (err) {
			console.log('DB cannot be opened:' + err);
			return;
		}

		console.log("DB running...");
	})

	db.on('error', function(err) {
		console.log('DB error:' + err);
	});
};