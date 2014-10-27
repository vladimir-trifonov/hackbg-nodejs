var dataService = require('./dataService.js');

module.exports = {
	getAllChirps: function(req, res) {
		dataService.getAllChirps(function(err, collection) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}

			res.send(JSON.stringify(collection));
		});
	},
	getAllUsers: function(req, res) {
		dataService.getAllUsers(function(err, collection) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}

			res.send(JSON.stringify(collection));
		});
	},
	getMyChirps: function(req, res) {
		dataService.getMyChirps(req.body, function(err, collection) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}

			res.send(JSON.stringify(collection));
		});
	},
	getChirps: function(req, res) {
		dataService.getChirps(req.body, function(err, collection) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}

			res.send(JSON.stringify(collection));
		});
	},
	postChirp: function(req, res) {
		dataService.postChirp(req.body, function(err, data) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}

			res.send(JSON.stringify({
				"chirpId": data.chirpId
			}));
		});
	},
	postRegister: function(req, res) {		
		dataService.postRegister(req.body, function(err, data) {
			if (err) {
				return res.send('Err: ' + err, 404);
			}
			res.send(JSON.stringify({
				"key": data.key
			}));
		});
	},
	deleteChirp: function(req, res) {
		dataService.deleteChirp(req.body, function(err, data) {
			if (err) {
				return res.send('Err: ' + err, 403);
			}

			res.send(JSON.stringify({
				"success": data.success
			}));
		});
	}
}