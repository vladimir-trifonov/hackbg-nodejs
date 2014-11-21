var cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	session = require('express-session'),
	passport = require('passport'),
	express = require('express');

module.exports = function(app, config) {
	app.set('view engine', 'ejs');
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(session({ secret: 'aleamena',
		resave : true, 
	    saveUninitialized : true
    }));	

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.set('views', config.rootPath + '/server/views');
	app.use(express.static(config.rootPath + '/public'));
}