var stream = require('stream'),
	util = require('util'),
	os = require('os');

var Transform = stream.Transform || require('readable-stream').Transform;

function LinkTranform(options) {
	if (!(this instanceof LinkTranform)) {
		return new LinkTranform(options);
	}

	this.replacePattern = /(<a.*?href\s*=\s*[\"']http)\s*/ig;

	Transform.call(this, options);
	return this;
}
util.inherits(LinkTranform, Transform);

LinkTranform.prototype._transform = function(chunk, enc, cb) {	
    var replacedText = chunk.toString().replace(this.replacePattern, '$1://localhost:3000/http');
	this.push(replacedText);
	cb();
};

module.exports.LinkTranform = LinkTranform;