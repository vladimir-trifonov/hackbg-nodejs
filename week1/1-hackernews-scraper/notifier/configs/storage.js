var storage = require('node-persist');

module.exports = function() {
	storage.initSync({
		dir: '../../../data/storage',
		stringify: JSON.stringify,
		parse: JSON.parse,
		encoding: 'utf8',
		logging: false,
		continuous: true,
		interval: false
	});
	return storage;
}