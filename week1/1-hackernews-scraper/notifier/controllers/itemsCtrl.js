var Item = require("../models/Item"),
	config = require("../configs/config"),
	Q = require('q');

module.exports = {
	getItemsData: function(storage) {
		var deferred = Q.defer();
		Item.getItems(config.itemsPath).then(function(data) {
			var resData = {};
			if(!data) {
				deferred.resolve();
			}

			resData.proceed = true;
			resData.items = data.items;
			return resData;
		})
		.then(function(data) {
			var resData =  data || {};

			if(resData.proceed === true) {
				Item.getProceededItems(storage)
					.then(function(proceededItems) {
							resData.proceededItems = proceededItems;
							deferred.resolve(resData);
						},
						function() {
							deferred.reject(err);
						});
			} else {
				deferred.resolve();
			}
		})
		.fail(function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	},
	setProceededItems: function(storage, proceededItems) {
		var deferred = Q.defer();
		Item.saveProceededItems(storage, proceededItems);
		deferred.resolve();
		return deferred.promise;
	}
}