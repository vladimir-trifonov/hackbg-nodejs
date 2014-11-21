module.exports = {
	login: function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	},
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},
	signup: function(req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	},
	isLoggedIn: function(req, res, next){
		if(req.isAuthenticated()) {
			return next();
		}

		res.redirect('/');
	}
}