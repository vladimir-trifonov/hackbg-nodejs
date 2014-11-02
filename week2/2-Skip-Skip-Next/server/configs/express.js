var bodyParser = require('body-parser');

module.exports = function(app, MongoClientWrapper) {
	app.use(bodyParser.json());
	app.all("*", function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
		res.header("Access-Control-Allow-Methods", ["GET"]);
		next();
	});
	app.use(function(req, res, next) {
		req.MongoClientWrapper = MongoClientWrapper;
		next();
	});
	app.use(function(err, req, res, next) {
		var err = new Error('Error: ' + err);
		err.status = 404;
		next(err);
	});
}