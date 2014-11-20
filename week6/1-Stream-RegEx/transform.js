var stream = require('stream'),
	util = require('util')
	os = require('os');

var Transform = stream.Transform || require('readable-stream').Transform;

function RegexTransform(options, regexExp) {
	if (!(this instanceof RegexTransform)) {
		return new RegexTransform(regexExp);
	}

	this.regexExp = regexExp;

	Transform.call(this, options);

	return this;
}
util.inherits(RegexTransform, Transform);

RegexTransform.prototype._transform = function(chunk, enc, cb) {	
	var result = '';
	if(chunk instanceof RegExp) {
		this.regexExp = chunk;
	} else {
		var chunkString = chunk.toString("utf8");		
		result = chunkString.match(this.regexExp);
		if(result === null) {
			result = '';
		}
	}
	
	this.push(result.join(os.EOL).toString());
	cb();
};

module.exports.RegexTransform = RegexTransform;