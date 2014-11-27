var controllers = require('../controllers'),
	passport = require('passport');

module.exports = function(app) {
	app.get('/auth/github',
		passport.authenticate('github'));
	app.get('/auth/github/callback',
		passport.authenticate('github', {
			failureRedirect: '/'
		}),
		function(req, res) {
			res.redirect('/profile');
		});

	app.get('/connect/facebook', passport.authorize('facebook', {
		scope: 'email'
	}));
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));
	app.get('/unlink/facebook', function(req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	app.get('/connect/twitter', passport.authorize('twitter', {
		scope: 'email'
	}));
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));
	app.get('/unlink/twitter', function(req, res) {
		var user = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	app.get('/profile', controllers.authCtrl.isLoggedIn, controllers.userCtrl.getProfile);
	app.get('/logout', controllers.authCtrl.logout);

	app.get('/', function(req, res) {
		res.render('index.ejs');
	})
}