var q = require('q'),
	fs = require('fs'),
	extend = require('util')._extend,
	Graph = require("../models/graph"),
	graphCtrl = require('./graphCtrl'),
	WorkerQueue = require("../common/utils/workerQueue").WorkerQueue,
	GitUser = require("../models/gitUser").GitUser;

var defaults = {
	'requestDelay': 0,
	'maxPagesCountPerIteraction': 5,
	'maxWaitPageRequestCyclesPerUser': 20,
	'maxUserRecordsPerPage': 30,
	'maxGraphDepth': 1,
	'currentGraphDepth': 0,
	'gitAPI_Users': 'https://api.github.com/users/',
	'gitPathUrl_Following': '/following?page=',
	'graph': null,
	'WorkerQueue': null,
	'requestOptions': {
		headers: {
			'User-Agent': 'request'
		}
	},
	'gitAppCredentials': {
		client_id: '2f9bf92952c109ec00a1',
		client_secret: 'f1620e61e644cfd25ff2e267a373f03deb686cf0'
	},
	'db': {}
};

module.exports = {
	createGraphFor: createGraphFor
}

function createGraphFor(req, res, next) {
	var data = req.body,
		userName = data.name;

	var initialUser = newUser(userName);
	initialUser.setOption('currentGraphDepth', 0);
};

function getDefaultOptions() {
	var options = extend({}, defaults, {
		graph: new Graph(),
		WorkerQueue: WorkerQueue,
		visited = {},
		threads = {},
		threadsCount = 0
	});

	return options;
};

function addThread(threadId) {
	this.incOption(threadsCount);
	this.getOption(threads)[threadId] = true;
};

function threadCompleted(threadId) {
	this.decOption(threadsCount);
	this.getOption(threads)[threadId] = false;
};

function saveOnAllCompleted() {
	if (this.getOption(threadsCount) === 0) {
		process.nextTick(function() {
			fs.writeFile('./graphExample.txt', graphCtrl.toString(self.options.graph), function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
	}
};

