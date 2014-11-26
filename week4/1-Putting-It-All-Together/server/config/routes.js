var controllers = require("../controllers"),
	auth = require('./auth');

module.exports = function(app) {
	app.post('/api/users', controllers.usersController.createUser);
	
	app.put('/api/snippets', auth.isAuthenticated, controllers.snippetsController.create);
	app.post('/api/snippets/:snippetId', auth.isAuthenticated, controllers.snippetsController.update);
	app['delete']('/api/snippets/:snippetId', auth.isAuthenticated, controllers.snippetsController['delete']);
	app.get('/api/snippets/', auth.isAuthenticated, controllers.snippetsController.read);
	app.get('/api/snippets/:snippetId', auth.isAuthenticated, controllers.snippetsController.read);

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