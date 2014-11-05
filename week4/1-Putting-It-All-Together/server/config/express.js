var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');

module.exports = function(app) {
	app.set('view engine', 'jade');
	app.set('views', config.rootPath + '/server/views');
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(express.static(config.rootPath + '/public'));	
}