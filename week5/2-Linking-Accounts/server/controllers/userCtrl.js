module.exports = {
	getMain: function(req, res) {
		res.render('main.ejs', {
			"user": req.user
		});
	}
}