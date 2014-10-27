var express = require('express'),
	app = express(),	
	config = require('./configs/config'),
	http = require('http');

var server = http.createServer(app);
require('./configs/server')(server);

server.listen(config.port);
console.log("Server running at port: " + config.port);
