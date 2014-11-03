var Q = require('q'),
	async = require('async'),
	storage = require('node-persist'),
	config = require('../configs/config'),
	Item = require("../data/Item"),
	Keyword = require("../data/Keyword"),
	tasks = [],
	isBusy = false,
	onCompleted = [],
	MongoClientWrapper = require("../configs/mongodb").MongoClientWrapper;

storage.initSync({
	dir: '../../../data/storage',
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	continuous: false,
	interval: false
});

module.exports = {
	parseDataAsync: parseDataAsync,
	onParserCompleted: onParserCompleted
}

function parseDataAsync(items, callback) {
	tasks.push(items);
	if (callback) {
		callback();
	}

	if (!isBusy) {
		isBusy = true;
		parseData();
	}
};

function onParserCompleted(callback) {
	if (isBusy) {
		onCompleted.push(callback);
	} else {
		callback();
	}
}

function parseData() {
	asyncWhile(tasks, extractKeywordsAsync, function() {
		asyncWhile(onCompleted, function(func, callback) {
			func();
			callback();
		}, function() {
			if (tasks.length > 0) {
				parseData();
			} else {
				isBusy = false;
			}
		})
	});
};

function asyncWhile(tasks, oper, done) {
	if (tasks.length === 0) {
		return done();
	}

	var task = tasks.shift();

	oper(task, function() {
		asyncWhile(tasks, oper, done);
	});
}

function extractKeywordsAsync(data, callback) {
	Keyword.countKeywords(data, storage)
		.then(function(vals) {
			Keyword.saveKeywordsCountsToDb(MongoClientWrapper, config.collectionKeywordsName, vals);
		})
		.then(function() {
			callback();
		});
}