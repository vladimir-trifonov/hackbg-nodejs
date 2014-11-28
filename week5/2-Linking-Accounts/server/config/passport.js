var GitHubStrategy = require('passport-github').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	passport = require('passport'),
	User = require('mongoose').model('User');

module.exports = function(config) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		})
	});

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback: true
		},
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				return done(null, profile);
			});
		}
	));

	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.consumerKey,
			consumerSecret: config.twitter.consumerSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				return done(null, profile);
			});
		}
	));

	passport.use(new GitHubStrategy({
			clientID: config.github.clientID,
			clientSecret: config.github.clientSecret,
			callbackURL: config.github.callbackURL,
			passReqToCallback: true
		},
		function(req, token, refreshToken, profile, done) {
			process.nextTick(function() {
				if (!req.user) {
					User.findOne({
						'github.id': profile.id
					}, function(err, user) {
						if (err) {
							return done(err);
						}

						if (user) {
							return done(null, user);
						} else {
							var newUser = new User();
							newUser.github.id = profile.id;
							newUser.github.token = token;
							newUser.github.name = profile.username;
							newUser.github.email = (profile.emails.length) ? profile.emails[0].value : null
							newUser.save(function(err) {
								if (err)
									throw err;

								return done(null, newUser);
							});
						}
					});
				} else {
					var user = req.user;
					user.github.id = profile.id;
					user.github.token = token;
					user.github.name = profile.username;
					user.github.email = profile.emails[0].value;

					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				}

			});
		}));
};