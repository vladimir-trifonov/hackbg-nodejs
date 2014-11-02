var Q = require('q');

module.exports = {
	saveLocation: function(collection, data) {
		var deferred = Q.defer();

		collection.insert({
			location: {
				type: "Point",
				coordinates: [
					parseFloat(data.position.lng, 10),
					parseFloat(data.position.lat, 10)
				]
			},
			name: data.name,
			tags: data.tags
		}, function(err) {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve()
		});

		return deferred.promise;
	},
	findLocation: function(collection, data) {
		var deferred = Q.defer(),
			points = [];

		collection.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: "Point",
						coordinates:  [
							parseFloat(data.position.lng, 10),
							parseFloat(data.position.lat, 10)
						]
					},
					$maxDistance: (data.range | 0) * 1000
				}
			},
			tags: {
				$all: data.tags || []
			}
		}, function(err, points) {			
			if (err) {
				return deferred.reject(err);
			}

			var result = [];
			points.forEach(function(point) {
				result.push({"name": point.name, "coordinates": point.location.coordinates})
			})
			deferred.resolve(result)
		});

		return deferred.promise;
	}
}