var config = require('./configs/config'),
	dataCtrl = require("./controllers/dataCtrl");

var promise  = require("./configs/mongodb")(config);
promise.fail(function(err) {
	console.log("Err: " + err);
}).done(function(db) {
	dataCtrl.migrateJSONToMongo(db);
});