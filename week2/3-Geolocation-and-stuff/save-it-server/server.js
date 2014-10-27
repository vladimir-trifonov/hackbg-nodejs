var express = require('express'),
	app = express(),	
	config = require('./configs/config');

var db = require('./configs/mongodb')(config);
require('./configs/express')(app, db);
require('./configs/routes')(app);

app.listen(config.port);
console.log("Server running at port: " + config.port);
