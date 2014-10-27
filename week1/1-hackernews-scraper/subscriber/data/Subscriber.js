var random = require('../common/random'),
	Q = require('q');

module.exports = {
	addSubscriber: function(data, storage) {
		var defer = Q.defer(),
			id = random.getRandomString(6),
			subscribersColl = storage.getItem('subscribers') || {};

		subscribersColl[id] = data;
		storage.setItem('subscribers', subscribersColl);

		defer.resolve({
			"email": data.email,
			"subscriberId": id
		});
		return defer.promise;
	},
	removeSubscriber: function(data, storage) {
		var defer = Q.defer(),
			subscribersColl = storage.getItem('subscribers') || {};

		subscribersColl.delete(data.subscriberId);
		storage.setItem('subscribers', subscribersColl);

		defer.resolve();
		return defer.promise;
	},
	getAllSubscribes: function(storage) {
		var defer = Q.defer(),
			subscribersColl = storage.getItem('subscribers') || {};

		defer.resolve(subscribersColl);
		return defer.promise;
	}
}
