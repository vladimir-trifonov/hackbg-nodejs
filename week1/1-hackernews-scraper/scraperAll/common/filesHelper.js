var fs = require('fs');

module.exports = {
	writeToFile: writeToFile,
	readFromFile: readFromFile
}

function writeToFile(path, data, callback) {
	fs.writeFile(path, data, function(err) {
		if (err) {
			return callback(err);
		}

		callback();
	});
}

function readFromFile(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {		
		if (err) {
			return callback(err);
		}

		callback(null, data);
	});
}