var fs = require('fs');

module.exports = {
	writeJSONFile: writeJSONFile,
	readJSONFile: readJSONFile
}

function writeJSONFile(data, path, callback) {
	fs.writeFile(path, JSON.stringify(data, null, 4), function(err) {
		if (err) {
			return callback(err);
		}
		callback(null);
	});
}

function readJSONFile(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		if (err) {
			return callback(err);
		}

		try {
			var jsonData = JSON.parse(data);
			callback(null, jsonData);
		} catch(e) {
			return callback(e);
		}
	});
}