var Q = require("q"),
	MongoClient = require('mongodb').MongoClient;

module.exports = function(config) {
	var deferred = Q.defer();
	MongoClient.connect(config.mongoConnectionUrl, function(err, db) {
		if(err) {
			return deferred.reject(err);
		}

		var dbService = {
			'getDb': function() {
				return db;
			},
			'closeDb': function() {
				db.close();
			}
		}
		
		deferred.resolve(dbService);
	});
	return deferred.promise;
}