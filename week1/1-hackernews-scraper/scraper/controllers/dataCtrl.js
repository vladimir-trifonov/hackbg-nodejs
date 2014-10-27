var Q = require('q'),
	Item = require("../data/Item");

module.exports = {
	pollNews: pollNews,
	storeData: storeData
}

function pollNews() {
	var deferred = Q.defer();

	Item.getMaxItemId()
		.then(function(maxItemId) {
			var data = {};
			data['maxitem'] = maxItemId | 0;
			return data;
		})
		.then(function(data) {
			var deferred = Q.defer();

			Item.getMaxItemIdFromStorage()
				.then(function(maxitem) {
					if (typeof maxitem === "undefined") {
						data['maxitemindb'] = data['maxitem'];
					} else {
						data['maxitemindb'] = maxitem | 0;
					}
					deferred.resolve(data);
				}, function(err) {
					deferred.reject(err);
				});

			return deferred.promise;
		})
		.then(function(data) {

			data['items'] = [];
			data['fromId'] = data['maxitemindb'] + 1;
			data['toId'] = data['maxitem'];
			data['itemTypes'] = ['comment', 'story'];
			data['itemTypesNested'] = { 'comment': { "parentItemType": "story", "itemIdSelector": "id", "parentIdSelector": "parent" } };

			if (data['maxitem'] !== data['maxitemindb']) {
				return Item.getItems(data);
			}
			data['noNewData'] = true;
			return data;
		})
		.then(function(data) {
				deferred.resolve(data);
			},
			function(err) {
				deferred.reject(err);
			});

	return deferred.promise;
};

function storeData(data) {
	var deferred = Q.defer();
	if(data['noNewData'] === true) {
		deferred.reject("No new data!");
	}

	Item.getStorage().then(function(allData) {
		if (typeof allData.items === "undefined") {
			allData.items = [];
		}
		allData['maxitem'] = data['maxitem'];
		[].push.apply(allData.items, data.items);
		Item.saveStorage(allData).then(function() {
			deferred.resolve(allData);
		}, function(err) {
			deferred.reject(err);
		});
	});

	return deferred.promise;
}