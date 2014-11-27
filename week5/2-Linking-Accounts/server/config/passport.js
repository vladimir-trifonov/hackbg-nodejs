var GitHubStrategy = require('passport-github').Strategy,
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

	passport.use(new GitHubStrategy({
			clientID: config.githubAuth.clientID,
			clientSecret: config.githubAuth.clientSecret,
			callbackURL: config.githubAuth.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.update({
				'githubId': profile.id
			}, {
				upsert: true
			}, function(err, user) {
				return done(err, user);
			});
		}
	));
};