var Q = require('q'),
	fs = require('fs'),
	config = require('./config');

module.exports = {
	getData: function() {
		var defer = Q.defer();
		config.getValue('collectionSrc').done(function(collectionSrc) {
			loadData(collectionSrc, function(err, data) {
				if (err) {
					console.log(err);
					return defer.reject();
				}
				
				defer.resolve(data);
			})
		})
		return defer.promise;
	}
};

function loadData(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		if (err) {
			return callback(err);
		}

		try {
			var jsonData = JSON.parse(data);
			callback(null, jsonData);
		} catch (e) {
			return callback(e);
		}
	});
};