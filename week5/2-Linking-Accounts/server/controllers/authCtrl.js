module.exports = {
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},
	isLoggedIn: function(req, res, next){
		if(req.isAuthenticated()) {
			return next();
		}

		res.redirect('/');
	}
}