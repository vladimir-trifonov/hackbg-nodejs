var mongo = require('mongodb'),
	monk = require('monk');

module.exports = function(config) {
	var db = monk(config.connectionString),
		collectionLocations = db.get('locations');

	collectionLocations.ensureIndex({location:"2dsphere"});
	return db;
}