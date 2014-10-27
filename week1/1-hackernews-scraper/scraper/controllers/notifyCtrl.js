var notifyUrl = 'localhost',
	notifyPath = '/newArticles',
	notifyPort = 8090,
	request = require('../common/request'),
	Q = require('q');

module.exports = {
	notify: function(data) {
		var deferred = Q.defer();
		if(data.items.length === 0) {
			return deferred.resolve();
		}

		var options = {
			host: notifyUrl,
			port: notifyPort,
			path: notifyPath,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		request(options, null, function(err, data) {
			if (err) {
				return deferred.reject(err);
			}
			deferred.resolve();
		});
		return deferred.promise;
	}
}