var dataService = require("../services/dataService"),
	config = require("../configs/config"),
	path = require('path'),
	fs = require('fs'),
	fileHelper = require("../helpers/fileHelper");

module.exports = {
	migrateJSONToMongo: function(db) {
		var srcFilePath  = path.join(path.dirname(fs.realpathSync(__filename)), config.srcFilePath);

		fileHelper.readJsonFromFile(srcFilePath, function(err, data) {
			if(err) {
				return err;
			}
			
			var promise = dataService.insertCollection(db.getDb(), config.collectionName, data);
			promise.then(function(res) {
				console.log("Insert: " + res);
			}, function(err) {
				console.log("Error: " + err);
			}).done(function() {
				db.closeDb();
			})
		})
	}
}