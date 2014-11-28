var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

//Keys are deleted; Please assure keys;
module.exports = {
	'development': {
		rootPath: rootPath,
		db: 'mongodb://localhost/test',
		port: process.env.PORT || 8070,
		github: {
			clientID: 'none',
			clientSecret: 'none',
			callbackURL: "/auth/github/callback"
		},
		facebook: {
			clientID: 'none',
			clientSecret: 'none',
			callbackURL: '/auth/facebook/callback'
		},
		twitter: {
			consumerKey: 'none',
			consumerSecret: 'none',
			callbackURL: "/auth/twitter/callback"
		}
	},
	'production': {
		rootPath: rootPath,
		db: 'mongodb://localhost/nodejs-course',
		port: process.env.PORT || 8070,
		github: {
			clientID: 'none',
			clientSecret: 'none',
			callbackURL: "/auth/github/callback"
		},
		facebook: {
			clientID: 'none',
			clientSecret: 'none',
			callbackURL: '/auth/facebook/callback'
		},
		twitter: {
			consumerKey: 'none',
			consumerSecret: 'none',
			callbackURL: "/auth/twitter/callback"
		}
	}
}