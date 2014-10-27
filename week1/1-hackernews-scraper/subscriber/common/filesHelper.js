var fs = require('fs');

module.exports = {
	saveDataToFile: function (path, data, callback) {
		return fs.writeFile(path, data, function(err) {
			if (err) {
				return callback(err);
			}
			callback();
		});
	}
}