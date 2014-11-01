var fs = require('fs');

module.exports = {
	readJsonFromFile: readJsonFromFile
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