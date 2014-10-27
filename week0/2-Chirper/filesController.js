var fs = require('fs');

module.exports = {
	writeFile: writeFile,
	readFile: readFile
}

function writeFile(data, path, callback) {
	fs.writeFile(path, data, function(err) {
		if (err) {
			return callback(err);
		}
	});
}

function readFile(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		var jsonObj = JSON.parse(data);

		if (err) {
			return callback(err);
		}

		callback(null, jsonObj);
	});
}