var q = require('q'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	Image = require('./Image').Image,
	divider = 10;

function Runner(imageData, imageType, kernel) {
	var self = this;

	this.imgHeight = imageData.length;
	this.imgWidth = imageData[0].length;
	this.numOfPixels = this.imgWidth * this.imgHeight;
	this.img = null;
	this.tasks = null;
	this.blockWidth = null;
	this.blockHeight = null;
	this.maxTaskId = null;

	this.img = new Image(imageData, imageType, kernel);
	this.calcTasksData();

	EventEmitter.call(this);
}
util.inherits(Runner, EventEmitter);

Runner.prototype.calcTasksData = function() {
	if (this.numOfPixels > 10000) {
		this.blockWidth = Math.floor(this.imgWidth / divider);
		this.blockHeight = Math.floor(this.imgHeight / divider);

		this.maxTaskId = (Math.ceil(this.imgWidth / divider) * Math.ceil(this.imgHeight / divider)) / 2;
	} else {
		this.blockWidth = this.imgWidth;
		this.blockHeight = this.imgWidth;
		this.maxTaskId = 1;
	}

	this.tasks = getRangeFrom(0, this.maxTaskId + 1);
}

Runner.prototype.process = function() {
	var self = this;

	do {
		(function(taskId) {
			setImmediate(function() {
				if (self.hasNextTask.call(self, taskId)) {
					var nextTask = self.getNextTask.call(self, taskId);
				} else {
					self.emit('ready', {
						imageData: self.img.getImageReady.call(self.img)
					});
				}
			});
		})(this.tasks.shift());
	} while (this.tasks.length > 0);
}

Runner.prototype.hasNextTask = function(taskId) {
	return taskId < this.maxTaskId;
}

Runner.prototype.getNextTask = function(taskId) {
	var areaOfInterest = this.getAreaOfInterest(taskId);
	this.img.process.call(this.img, areaOfInterest);
}

Runner.prototype.isInsideBorder = function(maxTaskId) {
	if (maxTaskId <= this.maxTaskId) {
		return true;
	}

	return false;
}

Runner.prototype.getAreaOfInterest = function(maxTaskId) {
	var row = Math.floor(maxTaskId / this.blockWidth),
		col = Math.floor(maxTaskId - (row * this.blockWidth));
	return {
		pointFrom: {
			"x": col * this.blockWidth,
			"y": row * this.blockHeight
		},
		pointTo: this.constrain({
			"x": (col + 1) * this.blockWidth,
			"y": (row + 1) * this.blockHeight
		})
	};
}

Runner.prototype.constrain = function(point) {
	if (point.x < 0) {
		point.x = 0;
	}
	if (point.y < 0) {
		point.y = 0;
	}
	if (point.x >= this.imgWidth) {
		point.x = this.imgWidth - 1;
	}
	if (point.y >= this.imgHeight) {
		point.y = this.imgHeight - 1;
	}
	return point;
}

function getRangeFrom(prevItemId, maxItemId) {
	var result = [];

	while (prevItemId < maxItemId) {
		result.push(prevItemId);
		prevItemId += 1;
	}

	return result;
}

module.exports.Runner = Runner;