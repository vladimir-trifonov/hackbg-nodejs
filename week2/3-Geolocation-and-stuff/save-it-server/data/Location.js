var Q = require('q');

module.export = {
	saveLocation: function(collection, data) {
		var defer = Q.defer();

		collection.insert(data, function(err) {
			if(err) {
				return defer.reject(err);
			}

			defer.resolve()
		});

		return defer.promise;
	}
}