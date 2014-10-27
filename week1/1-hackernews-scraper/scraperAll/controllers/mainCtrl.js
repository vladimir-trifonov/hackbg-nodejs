var Item = require("../data/Item"),
	config = require('../configs/config'),
	storage = require('node-persist').initSync(),
	factory = require('../common/factory'),
	Q = require('q'),
	async = require('async'),
	parser = require('./parseCtrl');

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
	getMaxItemFromStorage({
		'deferred': options.deferred
	});
};

function getMaxItemFromStorage(options) {
	var deferred = options.deferred;
	Item.getMaxItemFromStorage(function(err, maxItemFromStorage) {
		if (err) {
			return deferred.reject(err);
		}

		getMaxItem({
			'maxItemFromStorage': maxItemFromStorage,
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
			"maxItemFromStorage": options.maxItemFromStorage,
			"maxItem": maxItem,
			'deferred': options.deferred
		});
	})
};

function createRanges(options) {
	var deferred = options.deferred,
		firstItem = options.maxItemFromStorage + 1,
		lastItem = options.maxItem | 0,
		lastItem = lastItem;

	options.ranges = factory.getRangesArray(firstItem, lastItem, 20);

	poll(options);
};

function poll(options) {
	var deferred = options.deferred,
		ranges = options.ranges;
	var mm = null;
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

			parser.parseDataAsync(items, function(err) {
				if (err) {
					return whilstCallback(err);
				}
				Item.saveMaxItemToStorage(range[0], function(err) {
					if(err) {
						return whilstCallback(err);
					}

					whilstCallback();
				})
			});
		});
	}, function(err) {
		parser.onParserCompleted(function() {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve();
		})
	})
};