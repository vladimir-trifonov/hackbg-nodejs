var Q = require('q'),
	fs = require('fs'),
	configPath = './config.json';

var config = null;

module.exports = {
	getValue: function(key) {
		var defer = Q.defer();
		if (config === null) {
			loadConfig(configPath, function(err, data) {
				if (err) {
					console.log(err);
					return defer.reject();
				}

				config = data;
				defer.resolve(config[key]);
			});
		} else {
			defer.resolve(config[key]);
		}

		return defer.promise;
	}
};

function loadConfig(path, callback) {
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