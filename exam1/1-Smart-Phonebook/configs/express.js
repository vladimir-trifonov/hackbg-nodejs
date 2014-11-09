var bodyParser = require('body-parser');

module.exports = function(app) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(function(err, req, res, next) 	{	
		err.status = 404;
		next(err);
	});
}