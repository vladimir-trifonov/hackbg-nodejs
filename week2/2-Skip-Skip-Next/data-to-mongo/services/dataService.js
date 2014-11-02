var Q = require('q');

module.exports = {
	insertCollection: function(db, collectionName, data) {
		var deferred = Q.defer();
		var collection = db.collection(collectionName);

		var collectionForInsert = data.map(function(value, index, array) {
			var item = value;
			var keys = Object.keys(item);
			return {
				"keyword": keys[0],
				"matches": item[keys[0]]
			}
		})		

		collection.insert(collectionForInsert, function(err, res) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(res.length);
			db.close();
		})

		return deferred.promise;
	}
}