var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	'development': {
		rootPath: rootPath,
		db: 'mongodb://localhost/test',
		port: process.env.PORT || 8070,
		githubAuth: {
			clientID: 'bbe8a84c03243603bc57',
			clientSecret: 'efde335a3c8cf5fb54e05c2dc2e46873a2308282',
			callbackURL: "http://127.0.0.1:8070/auth/github/callback"
		}
	},
	'production': {
		rootPath: rootPath,
		db: 'mongodb://localhost/nodejs-course',
		port: process.env.PORT || 8070,
		githubAuth: {
			clientID: 'bbe8a84c03243603bc57',
			clientSecret: 'efde335a3c8cf5fb54e05c2dc2e46873a2308282',
			callbackURL: "http://127.0.0.1:8070/auth/github/callback"
		}
	}
}