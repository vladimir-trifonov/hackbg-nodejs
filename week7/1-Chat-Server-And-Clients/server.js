var express = require('express'),
	app = express(),
	config = require('./server/config/config');

require('./server/config/routes')(app);
require('./server/config/express')(app, config);

var io = require('socket.io').listen(app.listen(config.port));
require('./server/config/socket.io')(io);
console.log("Server running at port: " + config.port);