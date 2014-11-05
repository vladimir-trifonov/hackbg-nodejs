var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	'development': {
		rootPath: rootPath,
		db: 'mongodb://localhost/test',
		port: process.env.PORT || 7700
	},
	'production': {
		rootPath: rootPath,
		db: 'mongodb://localhost/nodejs-course',
		port: process.env.PORT || 7700
	}
}