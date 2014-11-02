var Location = require('../models/Location');

module.exports = {
	save: function(req, res) {
		var data = req.body,
			db = req.db,
			collection = db.get('locations');

		Location.saveLocation(collection, data).then(function() {
			console.log("Location Saved!");
			res.end(200);
		}, function(err) {
			console.log("Error: " + err);
			res.end(500);
		});
	},
	find: function(req, res) {		
		var data = req.query,
			db = req.db,
			collection = db.get('locations');

		Location.findLocation(collection, data).then(function(result) {
			res.send(result);
		}, function(err) {
			console.log("Error: " + err);
			res.end(500);
		});
	}
}