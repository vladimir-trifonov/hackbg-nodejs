var express = require('express'),
	app = express(),
	config = require('./config/config');

throw "It's not completed yet! :)"

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port);
console.log("Server running at port: " + config.port);