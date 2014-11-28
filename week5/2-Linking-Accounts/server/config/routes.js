var controllers = require('../controllers'),
	passport = require('passport');

module.exports = function(app) {
	app.get('/auth/github',
		passport.authorize('github', { failureRedirect: '/' }));
	app.get('/auth/github/callback', passport.authenticate('github', {
		successReturnToOrRedirect: '/profile',
		failureRedirect: '/'
	}));

	app.get('/connect/facebook', passport.authorize('facebook', { failureRedirect: '/' }));
	app.get('/connect/facebook/callback',
		passport.authorize('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}),
		function(req, res) {
			var user = req.user;
			var account = req.account;
			user.facebook.id = account.id;
			user.facebook.token = account.token;
			user.facebook.email = account.emails[0].value;;
			user.facebook.name = account.name.givenName + ' ' + account.name.familyName;

			user.save(function(err) {
				if (err) {
					return self.error(err);
				}
				self.redirect('/profile');
			});
		}
	);
	app.get('/unlink/facebook', function(req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	app.get('/connect/twitter', passport.authorize('twitter', { failureRedirect: '/' }));
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}),
		function(req, res) {
			var user = req.user;
			var account = req.account;
			user.twitter.id = account.id;
			user.twitter.token = account.token;
			user.twitter.displayName = account.displayName;
			user.twitter.username = account.username;

			user.save(function(err) {
				if (err) {
					return self.error(err);
				}
				self.redirect('/profile');
			});
		}
	);
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