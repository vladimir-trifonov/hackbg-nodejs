var express = require('express'),
	app = express(),
	env = process.env.NODE_ENV || 'development';
	config = require('./server/config/config')[env];
throw "It's not ready!"
require('./server/config/express')(app);
require('./server/config/mongoose')(config);
require('./server/config/passport')();
require('./server/config/routes')(app);

app.listen(config.port);

console.log("Server running at port: " + config.port);