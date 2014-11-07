var filesHelper = require("../common/filesHelper"),
	request = require("../common/request"),
	itemRequestOptions = {
		host: 'hacker-news.firebaseio.com',
		port: 443,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	},
	itemUrlPath = '/v0/item/',
	maxIitemUrlPath = '/v0/maxitem.json',
	maxItemFilePath = "maxItem.js",
	itemExt = '.json';

module.exports = {
	getMaxItemFromStorage: getMaxItemFromStorage,
	saveMaxItemToStorage: saveMaxItemToStorage,
	getMaxItemId: getMaxItemId,
	getItem: getItem,
	getMaxItemFromDb: getMaxItemFromDb,
	saveMaxItemToDb: saveMaxItemToDb
};

function getMaxItemFromStorage(callback) {
	filesHelper.readFromFile(maxItemFilePath, function(err, data) {
		if (err) {
			return callback(err);
		}

		var res = 0;
		if (typeof data !== "undefined" && data !== "") {
			var maxitem = parseFloat(data);

			if (!isNaN(maxitem)) {
				res = maxitem;
			}
		}
		callback(null, res);
	});
};

function saveMaxItemToStorage(maxItem, callback) {
	filesHelper.writeToFile(maxItemFilePath, maxItem, function(err) {
		if (err) {
			return callback(err);
		}

		callback();
	});
};

function getMaxItemId(callback) {
	itemRequestOptions.path = maxIitemUrlPath;
	request(itemRequestOptions, null, function(err, data) {
		if (err) {
			return callback(err);
		}
		callback(null, data);
	});
};

function getItem(id, callback) {
	itemRequestOptions.path = itemUrlPath + id + itemExt;
	request(itemRequestOptions, null, function(err, data) {
		if (err) {
			return callback(err);
		}
		callback(null, data);
	});
};

function getMaxItemFromDb(MongoClientWrapper, collectionName, callback) {
	var mongoClient = new MongoClientWrapper();

	mongoClient.connection()
		.then(function(cl) {
			cl.getCollection(collectionName).findOne({
				"var": "maxItem"
			}, function(err, result) {
				if (err) {
					return callback(err);
				}

				if (result) {
					callback(null, result.val);
				} else {
					callback(null, 0);
				}
				cl.closeDb();
			})
		}, function(err) {
			callback(err);
		});
};


function saveMaxItemToDb(MongoClientWrapper, collectionName, maxItem, callback) {
	var mongoClient = new MongoClientWrapper();

	mongoClient.connection()
		.then(function(cl) {
				cl.getCollection(collectionName).update({
					"var": "maxItem"
				}, {
					$set: {
						"val": maxItem
					}
				}, {
					upsert: true,
					multi: false
				}, function(err, count) {
					if (err) {
						return callback(err);
					}

					cl.closeDb();
					callback();
				});
			},
			function(err) {
				callback(err);
			});
};