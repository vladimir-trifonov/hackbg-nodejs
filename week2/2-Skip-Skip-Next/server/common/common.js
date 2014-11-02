module.exports = {
	standartResponse: function(res, err, result) {
		if(err) {
			return res.sendStatus(500);
		}
		res.send(result);
	}
}