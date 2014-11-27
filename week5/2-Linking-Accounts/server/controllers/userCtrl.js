module.exports = {
	getProfile: function(req, res) {
		res.render('profile.ejs', {
			"user": req.user
		});
	}
}