var request = require('request'),
	extend = require('util')._extend,
	os = require('os'),
	helper = require('../common/helpers/helper'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

GitUser = function(name, options) {
	this.name = name;
	this.options = options;

	this.EventEmitter

	this.currentRequest = 0;
	this.currentResponse = 0;
	this.waitCycle = 0;
	this.maxWaitCycles = this.options.maxWaitPageRequestCyclesPerUser;
	this.remainRequest = this.options.maxPagesCountPerIteraction;
	this.pauseRequests = false;
	this.stopRequests = false;
	this.proceedNeighbors = null;
	this.threadId = new Date().getTime();

	return this;
};
util.inherits(GitUser, EventEmitter);

GitUser.prototype.run = function() {
	var followingQueue = new this.options.WorkerQueue(this.options.requestDelay);
	followingQueue.push(this.getFollowings.bind(this));
};

GitUser.prototype.getThreadId = function() {
	return this.threadId;
};

GitUser.prototype.setOption = function(key, value) {
	this.options[key] = value;
};

GitUser.prototype.getOption = function(key) {
	return this.options[key];
};

GitUser.prototype.incOption = function(key) {
	this.options[key] += 1;
};

GitUser.prototype.decOption = function(key) {
	this.options[key] -= 1;
};

GitUser.prototype.getFollowings = function(repeatRequest, url) {
	var self = this;

	if (this.stopRequests) {
		this.emit('completed', this.threadId);
		return true;
	}

	if (!repeatRequest && this.currentResponse === this.remainRequest) {
		this.remainRequest *= 2;
		this.pauseRequests = false;
	}

	if (!repeatRequest && this.pauseRequests) {
		return;
	}

	if (!repeatRequest && this.currentRequest === this.remainRequest) {
		this.pauseRequests = true;

		this.waitCycle++;
		if (this.waitCycle === this.maxWaitCycles) {
			this.stopRequests
		}
	} else {
		var requestOptions = extend({}, this.options.requestOptions),
			url = url || this.options.gitAPI_Users +
			this.name +
			this.options.gitPathUrl_Following +
			this.currentRequest +
			"&client_id=" +
			this.options.gitAppCredentials.client_id +
			"&client_secret=" +
			this.options.gitAppCredentials.client_secret;

		requestOptions.url = url;

		request(requestOptions, function(error, response, body) {
			if (error) {
				console.log(error);

				if (!repeatRequest) {
					return process.nextTick(function() {
						self.getFollowing.call(self, true, url);
					});
				}
			}

			if (!error && response.statusCode == 200) {
				return self.processData(body);
			} else {
				console.log("StatusCode: " + response.statusCode + os.EOL + "Body:" + body);

				self.currentResponse++;
			}
		});

		if (!repeatRequest) {
			this.currentRequest++;
		}
	}
};

GitUser.prototype.processData = function(data) {
	if (!this.isPageCompleted(data)) {
		this.stopRequests = true;
	}
	this.currentResponse++;
};

GitUser.prototype.isPageCompleted = function(data) {
	var responseData = helper.parseJSON(data);

	if (responseData.length > 0) {
		this.emit('chunk', responseData);
	}

	if (responseData.length < this.options.maxUserRecordsPerPage) {
		return false;
	}

	return true;
};

module.exports.GitUser = GitUser;