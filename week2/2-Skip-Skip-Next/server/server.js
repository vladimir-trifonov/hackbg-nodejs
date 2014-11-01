var express = require('express'),
	app = express(),
	config = require('./configs/config');

var promise  = require("./configs/mongodb")(config);
promise.fail(function(err) {
	console.log("Err: " + err);
}).done(function(db) {
	require('./configs/express')(app, db);
	require('./configs/routes')(app);

	app.listen(config.port);
	console.log("Server running at port: " + config.port);
});


