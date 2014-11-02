var express = require('express'),
	app = express(),
	mongodb = require('./configs/mongodb')
	config = require('./configs/config');

require("./configs/mongodb");
require('./configs/express')(app, mongodb.MongoClientWrapper);
require('./configs/routes')(app);

app.listen(config.port);
console.log("Server running at port: " + config.port);


