module.exports = {
	'development': {
		port: process.env.PORT || 8070,
		db: 'mongodb://localhost/test'
	},
	'production': {
		port: process.env.PORT || 8070,
		db: 'mongodb://localhost/nodejs-course'
	}
}