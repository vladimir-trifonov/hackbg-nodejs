var bodyParser = require('body-parser');

module.exports = function(app, storage) {
	app.use(bodyParser.json());
	app.use(function(req, res, next) {
		req.storage = storage;
		next();
	});
	app.use(function(err, req, res, next) {
		var err = new Error('Error: ' + err);
		err.status = 404;
		next(err);
	});
}