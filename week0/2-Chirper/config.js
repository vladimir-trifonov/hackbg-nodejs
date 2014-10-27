var fc = require("./filesController"),
	configPath = './config.json';

module.exports = {
	getConfig: getConfig,
	saveConfig: saveConfig
}

function getConfig(callback) {
	fc.readFile(configPath, function(err, data) {
		if (err) {
			return callback(err);
		}

		callback(null, data);
	})
}

function saveConfig(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		Object.keys(data).forEach(function(key) {
			config[key] = data[key];
		})

		fc.writeFile(JSON.stringify(config,null ,4), configPath, callback);
	})

}