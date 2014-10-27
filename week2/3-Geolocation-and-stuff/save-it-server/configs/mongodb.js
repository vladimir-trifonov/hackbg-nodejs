var mongo = require('mongodb'),
	monk = require('monk');

module.exports = function(config) {
	var db = monk(config.connectionString),
		collectionLocations = db.get('locations');

	collectionLocations.index({'2dsphereIndexVersion': 1});
	return db;
}