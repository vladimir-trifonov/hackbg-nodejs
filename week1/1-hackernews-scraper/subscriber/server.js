var express = require('express'),
	app = express(),	
	config = require('./configs/config');

var storage = require('./configs/storage')();
require('./configs/express')(app, storage);
require('./configs/routes')(app);

app.listen(config.port);
console.log("Server running at port: " + config.port);
