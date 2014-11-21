var controllers = require("../controllers");

module.exports = function(app) {
	app.post('/api/snipets', auth.isAuthenticated, controllers.snipetsController.create);
	app.put('/api/snipets/:snipetId', auth.isAuthenticated, controllers.snipetsController.update);
	app['delete']('/api/snipets/:snipetId', auth.isAuthenticated, controllers.snipetsController['delete']);
	app.get('/api/snipets/', auth.isAuthenticated, controllers.snipetsController.read);

	app.get('/partials/:partialArea/:partialName', function(req, res) {
		res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName);
	});

	app.get('/partials/:partialArea/:partialName', function(req, res) {
		res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName);
	});

	app.post('/login', auth.login);
	app.post('/logout', auth.logout);

	app.get('/api/*', function(req, res) {
		res.status(404);
		res.end();
	});

	app.get('*', function(req, res) {
		res.render('index', {currentUser: req.user});
	});
};