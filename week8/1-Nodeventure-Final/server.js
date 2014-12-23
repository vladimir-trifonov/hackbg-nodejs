var express = require('express'),
	app = express(),
	config = require('./server/config/config'),
	Engine = require("./server/game/Engine");

require('./server/config/routes')(app);
require('./server/config/express')(app, config);

var io = require('socket.io').listen(app.listen(config.port));

var engine = new Engine(io);
require('./server/config/socket.io')(io, engine);
require('./server/controllers/UnitsCtrl').setEngine(engine);

console.log("Server running at port: " + config.port);