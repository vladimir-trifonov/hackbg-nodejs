var fc = require("./filesCtrl"),
	Q = require('q');

module.exports = {
	readFile: readFile
}

function readFile(path) {
	var deferred = Q.defer();
	fc.readJsonFromFile(path, function(err, data) {
		if(err) {
			return deferred.reject(err);
		}

		deferred.resolve(data);
	})

	return deferred.promise;
};