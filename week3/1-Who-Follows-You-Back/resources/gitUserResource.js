var request = require('request'),
	extend = require('util')._extend,
	os = require('os'),
	helper = require('../common/helpers/helper'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

GitUserResource = function(name, options) {
	this.name = name;
	this.options = options;

	EventEmitter.call(this);

	this.currentRequest = [];
	this.currentResponse = [];
	this.currentThreadId = [];
	this.remainRequest = this.options.maxPagesCountPerIteraction;
	this.pauseRequests = false;
	this.stopRequests = false;
	this.threadId = this.options.threads.length;

	return this;
};
util.inherits(GitUserResource, EventEmitter);

GitUserResource.prototype.run = function() {
	var followingQueue = new this.options.WorkerQueue(this.options.requestDelay);
	followingQueue.push(this.getFollowings.bind(this));
};

GitUserResource.prototype.getThreadId = function() {
	return this.threadId;
};

GitUserResource.prototype.getFollowings = function(repeatRequest, url) {
	var self = this;

	if (this.stopRequests) {
		if(this.currentRequest.length === this.currentResponse.length) {
			this.emit('completed', this.threadId);
			return true;
		}

		return;
	}

	if (!repeatRequest && this.currentResponse.length === this.remainRequest) {
		this.remainRequest *= 2;
		this.pauseRequests = false;
	}

	if (!repeatRequest && this.pauseRequests) {
		return;
	}

	if (!repeatRequest && this.currentRequest.length === this.remainRequest) {
		this.pauseRequests = true;
	} else {
		var requestOptions = extend({}, this.options.requestOptions),
			url = url || this.options.gitAPI_Users +
			this.name +
			this.options.gitPathUrl_Following +
			(this.currentRequest.length + 1) +
			"&client_id=" +
			this.options.gitAppCredentials.client_id +
			"&client_secret=" +
			this.options.gitAppCredentials.client_secret;
		requestOptions.url = url;
		this.currentThreadId.push(this.currentRequest.length);

		(function(threadId) {
			request(requestOptions, function(error, response, body) {
				if (error) {
					console.log(error);

					if (!repeatRequest) {
						return process.nextTick(function() {
							self.getFollowings.call(self, true, url);
						});
					}
				}

				if (!error && response.statusCode == 200) {
					return self.processData(body, threadId);
				} else {
					console.log("StatusCode: " + response.statusCode + os.EOL + "Body:" + body);

					self.currentResponse.push(self.currentResponse.length);
				}
			});
		})(self.currentThreadId.shift());

		if (!repeatRequest) {
			this.currentRequest.push(this.currentRequest.length);
		}
	}
};

GitUserResource.prototype.processData = function(data, id) {
	if (!this.isPageCompleted(data, id)) {
		this.stopRequests = true;
	}
	this.currentResponse.push(this.currentResponse.length);
};

GitUserResource.prototype.isPageCompleted = function(data, id) {
	var responseData = helper.parseJSON(data);

	if (responseData.length > 0) {
		this.emit('chunk', responseData, id);
	}

	if (responseData.length < this.options.maxUserRecordsPerPage) {
		return false;
	}

	return true;
};

module.exports.GitUserResource = GitUserResource;