var stream = require('stream'),
	util = require('util'),
	bigint = require('bigint'),
	os = require('os');

var Transform = stream.Transform || require('readable-stream').Transform;

function SumTranform(options) {
	if (!(this instanceof SumTranform)) {
		return new SumTranform(options);
	}

	this.res = bigint(0);

	Transform.call(this, options);
	return this;
}
util.inherits(SumTranform, Transform);

SumTranform.prototype._transform = function(chunk, enc, cb) {
	var self = this,
		nums = (chunk.toString().trim()).replace(os.EOL, '').split(",");

	nums.forEach(function(num) {
		self.res = self.res.add(num | 0);
	})
	cb();
};

module.exports.SumTranform = SumTranform;