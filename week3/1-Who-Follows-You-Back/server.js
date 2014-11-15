var express = require('express'),
	app = express(),
	env = process.env.NODE_ENV || 'development',
	config = require('./config/config')[env];

require('./config/mongoose')(config);
require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port);
console.log("Server running at port: " + config.port);