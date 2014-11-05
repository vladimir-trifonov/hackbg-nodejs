var controllers = require("../controllers");

module.exports = function(app) {
	app.post('/api/snipets', controllers.snipetsController.create);
	app.put('/api/snipets/:snipetId', controllers.snipetsController.update);
	app['delete']('/api/snipets/:snipetId', controllers.snipetsController['delete']);
	app.get('/api/snipets/', controllers.snipetsController.read);

	app.get('/partials/:partialArea/:partialName', function(req, res) {
		res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName);
	});

	app.get('/api/*', function(req, res) {
		res.status(404);
		res.end();
	});

	app.get('*', function(req, res) {
		res.render('index');
	});
};