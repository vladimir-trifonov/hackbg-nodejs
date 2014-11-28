module.exports = {
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
			res.send("Authentication required", 401);
		} else {
			res.redirect('/');
		}

	}
}