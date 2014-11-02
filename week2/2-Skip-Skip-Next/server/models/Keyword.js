var Q = require("q");

module.exports = {
	getKeywords: getKeywords
}

function getKeywords(sort, skip, limit, MongoClientWrapper, collectionName) {
	var deferred = Q.defer();
	var mongoClient = new MongoClientWrapper();

	mongoClient.connection()
		.then(function(cl) {
			var cursor = cl.getCollection(collectionName).find({}, {_id: false}).sort(sort).skip(skip).limit(limit);
			cl.getCollection(collectionName).find({}).count(function(err, count) {
				if(err) {
					return deferred.reject(err);
				}

				deferred.resolve({"collection": cursor, "close": cl.closeDb.bind(mongoClient), "length": count });
			});

		},
		function(err) {
			deferred.reject(err);
		});

	return deferred.promise;
}