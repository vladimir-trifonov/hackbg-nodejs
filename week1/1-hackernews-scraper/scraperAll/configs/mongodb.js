var Q = require("q"),
	config = require("./config"),
	MongoClient = require('mongodb').MongoClient;

module.exports = {
	MongoClientWrapper: MongoClientWrapper
}

function MongoClientWrapper() {
	var self = this;
	var deferred = Q.defer();

	MongoClient.connect(config.mongoConnectionUrl, function(err, db) {
		if (err) {
			return deferred.reject(err);
		}
		self._db = db;
		deferred.resolve(self);
	});

	this._promise = deferred.promise;
}

MongoClientWrapper.prototype.connection = function() {
	return this._promise;
}

MongoClientWrapper.prototype.getDb = function() {
	return this._db;
}

MongoClientWrapper.prototype.getCollection = function(collectionName) {
	return this._db.collection(collectionName);
}

MongoClientWrapper.prototype.closeDb = function() {	
	this._db.close();
}
