var express = require('express'),
	app = express(),
	env = process.env.NODE_ENV || 'development',
	config = require('./configs/config')[env];

require('./configs/express')(app);
require('./configs/routes')(app, express);

app.listen(config.port);
console.log("Server running at port: " + config.port);	
