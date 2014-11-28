var express = require('express'),
	app = express(),
	env = process.env.NODE_ENV || 'development',
	config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);
require('./server/config/passport')(config);
require('./server/config/express')(app, config);
require('./server/config/routes')(app);

app.listen(config.port);
console.log('Server running at port: ' + config.port);
console.log('Auth keys are deleted! Please assure keys!');