var _ = require('underscore')._;

var strSrc = 'abcdefghijklmnopqrstuvwxyz0123456789';
var srcArr = strSrc.split("");

module.exports = {
	getRandomKey: function(length) {
		srcArr = _.shuffle(srcArr);
		var srcSample = _.sample(srcArr, length);
		return srcSample.join('');
	}
}