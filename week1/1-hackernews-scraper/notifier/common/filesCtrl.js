var fs = require('fs');

module.exports = {
	writeJsonToFile: writeJsonToFile,
	readJsonFromFile: readJsonFromFile
}

function writeJsonToFile(data, path, callback) {
	fs.writeFile(path, JSON.stringify(data), function(err) {
		if (err) {
			return callback(err);
		}

		callback();
	});
}

function readJsonFromFile(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		var jsonObj = null;
		if (err) {
			return callback(err);
		}

		try {
			jsonObj = JSON.parse(data);
		} catch(e) {
			return callback(e);
		}

		callback(null, jsonObj);
	});
}