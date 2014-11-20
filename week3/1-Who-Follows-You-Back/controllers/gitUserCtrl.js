var q = require('q'),
	fs = require('fs'),
	extend = require('util')._extend,
	Graph = require("../lib/graph").Graph,
	graphCtrl = require('./graphCtrl'),
	WorkerQueue = require("../common/utils/workerQueue").WorkerQueue,
	GitUserResource = require("../resources/gitUserResource").GitUserResource,
	GitUser = require('mongoose').model('GitUser'),
	defaults = {
		'requestDelay': 400,
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

module.exports = {
	createGraphFor: createGraphFor,
	following: following,
	isFollowing: isFollowing,
	stepsTo: stepsTo,
	mutuallyFollow: mutuallyFollow
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
		depth = data.depth || 1,
		options = {
			'graphId': res.locals.graphId,
			'graphName': userName
		};

	if (typeof depth !== "undefined") {
		options.maxGraphDepth = depth;
	}

	newgGitUserResource(userName, options, true);
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
	console.log("Added: " + threadId);
	this.options.threads.push(threadId);
};

function threadCompleted(threadId) {
	console.log("Completed: " + threadId);
	this.options.threads.splice(this.options.threads.indexOf(threadId), 1);
	if (this.options.threads.length === 0) {
		saveOnAllCompleted.call(this);
	}
};

function initGitUserEventHandlers(gitUserResource) {
	gitUserResource.on('chunk', function(data, id) {
		var self = this,
			threadId = this.getThreadId();

		graphCtrl.createEdges(self.options.graph, self.name, data);

		if (this.options.depth.length < this.options.maxGraphDepth ||
			this.options.depth.indexOf(threadId) !== -1) {
			if (this.options.depth.indexOf(threadId) === -1) {
				this.options.depth.push(threadId);
			}

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
		var graph = graphCtrl.toArray(self.options.graph, "name", "following");
		GitUser.update({
			_id: this.options.graphId
		}, {
			$set: {
				status: "ready",
				followings: graph
			}
		}, {
			upsert: true,
			multiple: true
		}, function(err) {
			if (err) {
				return console.log('Group could not be updated!');
			}
		})
	}
};

function following() {
	return graphCtrl.getNeighborsFor(self.options.graph, this.options.graphName);
};

function isFollowing(name) {
	return graphCtrl.pathBetween(self.options.graph, this.options.graphName, name);
};

function stepsTo() {
	throw "Not Implemented!";
};

function mutuallyFollow(req, res, next) {
	if (!req.params.username) {
		res.status(400);
		res.end();
		return;
	}

	var graph = res.locals.graph;

	var first = graphCtrl.pathBetween(graph, data.name, req.params.username),
		second = graphCtrl.pathBetween(graph, req.params.username, data.name),
		result = {};

	if (first === true && second === true) {
		result.relation = "mutual";
	} else if (first === true) {
		result.relation = "first";
	} else if (second === true) {
		result.relation = "second";
	}

	res.send(result);
};
