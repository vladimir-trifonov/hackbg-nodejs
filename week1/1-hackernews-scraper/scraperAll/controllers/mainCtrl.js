var Item = require("../models/Item"),
	config = require('../configs/config'),
	factory = require('../common/factory'),
	Q = require('q'),
	async = require('async'),
	parser = require('./parseCtrl'),
	MongoClientWrapper = require("../configs/mongodb").MongoClientWrapper;

module.exports = {
	scraperAll: function(next) {
		var deferred = Q.defer();
		startTask({
			"deferred": deferred
		});

		deferred.promise.then(function() {
			next();
		}, function(err) {
			next(err);
		})
	}
};

function startTask(options) {
	getMaxItemFromDb({
		'deferred': options.deferred
	});
};

function getMaxItemFromDb(options) {
	var deferred = options.deferred;
	Item.getMaxItemFromDb(MongoClientWrapper, config.collectionMaxItemName, function(err, maxItemТreated) {
		if (err) {
			return deferred.reject(err);
		}

		getMaxItem({
			'maxItemТreated': maxItemТreated,
			'deferred': options.deferred
		});
	})
}

function getMaxItemFromStorage(options) {
	var deferred = options.deferred;
	Item.getMaxItemFromStorage(function(err, maxItemТreated) {
		if (err) {
			return deferred.reject(err);
		}

		getMaxItem({
			'maxItemТreated': maxItemТreated,
			'deferred': options.deferred
		});
	})
};

function getMaxItem(options) {
	var deferred = options.deferred;

	Item.getMaxItemId(function(err, maxItem) {
		if (err) {
			return deferred.reject(err);
		}

		createRanges({
			'maxItemТreated': options.maxItemТreated,
			'maxItem': maxItem,
			'deferred': options.deferred
		});
	})
};

function createRanges(options) {
	var deferred = options.deferred,
		firstItem = options.maxItemТreated + 1,
		lastItem = options.maxItem | 0,
		lastItem = lastItem;

	options.ranges = factory.getRangesArray(firstItem, lastItem, 20);

	poll(options);
};

function poll(options) {
	var deferred = options.deferred,
		ranges = options.ranges;

	async.whilst(function() {
		return ranges.hasRange();
	}, function(whilstCallback) {
		var range = ranges.getRange(),
			items = [];

		async.until(function() {
			return range[1] <= range[0];
		}, function(untilCallback) {

			Item.getItem(range[0], function(err, item) {
				if (err) {
					return untilCallback(err);
				}

				items.push(item);
				range[0] += 1;
				async.nextTick(function() {
					untilCallback();
				});
			});

		}, function(err) {
			if (err) {
				return whilstCallback(err);
			}

			Item.saveMaxItemToDb(MongoClientWrapper, config.collectionMaxItemName, range[0], function(err) {
				if (err) {
					return whilstCallback(err);
				}

				parser.parseDataAsync(items, function(err) {
					if (err) {
						return whilstCallback(err);
					}

					whilstCallback();
				});
			});
		});
	}, function(err) {

		parser.onParserCompleted(function() {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve();
		});

	});
};