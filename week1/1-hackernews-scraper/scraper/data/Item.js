var dataUrl = 'hacker-news.firebaseio.com',
	dataPort = 443,
	maxItemPath = '/v0/maxitem.json',
	itemPath = '/v0/item/',
	itemExt = '.json',
	Q = require('q'),
	http = require('http'),
	request = require('../common/request'),
	fc = require('../controllers/filesCtrl'),
	storagePath = '../articles.json';

var dataCtrl = {
	getMaxItemId: function() {
		var deferred = Q.defer();

		var options = {
			host: dataUrl,
			port: dataPort,
			path: maxItemPath,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		request(options, null, function(err, data) {
			if (err) {
				return deferred.reject(err);
			}
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getMaxItemIdFromStorage: function(data) {
		var deferred = Q.defer();

		fc.readJSONFile(storagePath, function(err, fileData) {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve(fileData['maxitem']);
		})

		return deferred.promise;
	},
	getItems: function(data) {
		var deferred = Q.defer();

		var requestOptions = {
			host: dataUrl,
			port: dataPort,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		var options = {
			'nextId': data['fromId'],
			'store': data,
			'requestOptions': requestOptions,
			'deferred': Q.defer()
		};

		this.getItem(options)
			.then(function(data) {
				deferred.resolve(data.store);
			})
			.fail(function(err) {
				deferred.reject(new Error(err));
			});

		return deferred.promise;
	},
	getItem: function(data) {
		data.requestOptions.path = itemPath + data.nextId + itemExt;
		request(data.requestOptions, null, function(err, res) {
			var item = null;

			if (res.error) {
				if (data.lastErr && data.lastErr !== data.nextId) {
					data.lastErr = data.nextId;
					dataCtrl.getItem(data);
				} else {
					next();
				}
			}

			try {
				item = JSON.parse(res);
			} catch (e) {
				next();
			}

			if (data.store.itemTypes.indexOf(item.type) !== -1) {
				var nestedProperties = data.store.itemTypesNested[item.type];
				if (nestedProperties) {
					nestedProperties.deferred = Q.defer();

					var options = {
						"targetId": item[nestedProperties["parentIdSelector"]],
						"targetSelector": nestedProperties["itemIdSelector"],
						"targetParentSelector": nestedProperties["parentIdSelector"],
						"targetType": nestedProperties["parentItemType"],
						"deferred": nestedProperties.deferred,
						"requestOptions": data.requestOptions
					};

					dataCtrl.getItemParentByType(options)
						.done(function(parent) {
							parent.children = [];
							parent.children.push(item);
							data.store.items.push(parent);
							next();
						})

				} else {
					data.store.items.push(item);
					next();
				}
			}

			function next() {
				data.nextId = data.nextId + 1;
				if (data.nextId <= data.store.toId) {
					dataCtrl.getItem(data);
				} else {
					data.deferred.resolve(data);
				}
			};
		});
		return data.deferred.promise;
	},
	getItemParentByType: function(options) {
		options.requestOptions.path = itemPath + options.targetId + itemExt;

		request(options.requestOptions, null, function(err, res) {
			var item = null;

			if (err) {
				return options.deferred.resolve({});
			}

			try {
				item = JSON.parse(res);
			} catch (e) {
				return options.deferred.resolve({});
			}

			if (item['type'] === options.targetType) {
				options.deferred.resolve(item);
			} else {
				options.targetId = item[options['targetParentSelector']];
				dataCtrl.getItemParentByType(options);
			}
		});

		return options.deferred.promise;
	},
	getStorage: function() {
		var deferred = Q.defer();

		fc.readJSONFile(storagePath, function(err, fileData) {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve(fileData);
		})

		return deferred.promise;
	},
	saveStorage: function(data) {
		var deferred = Q.defer();
		fc.writeJSONFile(data, storagePath, function(err) {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve(data);
		})
		return deferred.promise;
	}
};

module.exports = dataCtrl;