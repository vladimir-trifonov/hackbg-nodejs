var q = require('q'),
	fs = require('fs'),
	extend = require('util')._extend,
	Graph = require("../lib/graph").Graph,
	graphCtrl = require('./graphCtrl'),
	WorkerQueue = require("../common/utils/workerQueue").WorkerQueue,
	GitUserResource = require("../resources/gitUserResource").GitUserResource,
	GitUser = require('mongoose').model('GitUser'),
	defaults = {
		'requestDelay': 200,
		'maxPagesCountPerIteraction': 2,
		'maxUserRecordsPerPage': 30,
		'maxGraphDepth': 4,
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
		}
	};

var newgGitUserResource = (function() {
	return function(name, options, isInitUser) {
		var options = options || {};
		if (isInitUser) {
			options = getInitOptions(options);
		}

		options.visited[name] = true;

		var gitUserResource = new GitUserResource(name, options);
		initGitUserEventHandlers(gitUserResource);

		addThread.call(gitUserResource, gitUserResource.getThreadId());
		gitUserResource.run();

		return gitUserResource;
	}
})();

function createGraphFor(req, res, next) {
	var data = req.body,
		userName = data.name,
		depth = data.depth || 4;	

	if (depth) {
		newgGitUserResource(userName, {
			'maxGraphDepth': depth
		}, true);
	} else {
		newgGitUserResource(userName, {}, true);
	}

	res.end();
};

function getInitOptions(options) {
	var defaultOptions = extend({}, defaults);
	defaultOptions = extend(defaultOptions, {
		graph: new Graph(),
		WorkerQueue: WorkerQueue,
		visited: {},
		threads: [],
		depth: [],
		currentGraphDepth: []
	});
	defaultOptions = extend(defaultOptions, options);

	return defaultOptions;
};

function addThread(threadId) {
	this.options.threads.push(threadId);
};

function threadCompleted(threadId) {
	this.options.threads.splice(this.options.threads.indexOf(threadId), 1);
	if(this.options.threads.length === 0) {
		this.saveOnAllCompleted.call(this);
	}
};

function initGitUserEventHandlers(gitUserResource) {
	gitUserResource.on('chunk', function(data, id) {
		var self = this,
			threadId = this.getThreadId();

		addThread.call(self, threadId + '/' + id);
		(function(data) {
			process.nextTick(function() {
				graphCtrl.createEdges(self.options.graph, self.name, data);
				threadCompleted.call(self, threadId + '/' + id);
			});
		})(data);


		if (this.options.depth.indexOf(threadId) === -1) {
			this.options.depth.push(threadId);
		}

		if (this.options.depth.length < this.options.maxGraphDepth) {
			data.forEach(function(neighbor) {
				var neighborName = neighbor.login;
				if (neighborName && !self.options.visited[neighborName]) {
					self.options.visited[neighborName] = true;
					newgGitUserResource(neighborName, self.options, false);
				}
			})
		}
	});

	gitUserResource.on('completed', function(threadId) {
		threadCompleted.call(this, threadId);
	});
};

function saveOnAllCompleted() {
	var self = this;
	if (this.options.threads.length === 0) {
		setImmediate(function() {
			fs.writeFile('../graphExample.txt', graphCtrl.toString(self.options.graph), function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
	}
};

function following() {
	throw "Not Implemented!";
}

function isFollowing() {
	throw "Not Implemented!";
}

function stepsTo() {
	throw "Not Implemented!";
}

function mutuallyFollow(req, res, next) {
	throw "Not Implemented!";
}

module.exports = {
	createGraphFor: createGraphFor,
	following: following,
	isFollowing: isFollowing,
	stepsTo: stepsTo,
	mutuallyFollow: mutuallyFollow
}