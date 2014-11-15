var bodyParser = require('body-parser');

module.exports = function(app) {
	app.use(bodyParser.json());
	
	app.use(function(err, req, res, next) {
		var err = new Error('Error: ' + err);
		err.status = 404;
		next(err);
	});
}