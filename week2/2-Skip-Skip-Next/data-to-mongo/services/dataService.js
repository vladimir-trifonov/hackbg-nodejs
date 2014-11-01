var Q = require('q');

module.exports = {
	insertCollection: function(db, collectionName, data) {
		var deferred = Q.defer();
		var collection = db.collection(collectionName);

		collection.insert(data, function(err, res) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(res.length);
		})

		return deferred.promise;
	}
}