var controllers = require('../controllers'),
	passport = require('passport');

module.exports = function(app) {
	app.get('/login', controllers.authCtrl.login);
	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/main', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));
	app.get('/logout', controllers.authCtrl.logout);

	app.get('/signup', controllers.authCtrl.signup);
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/main',
		failureRedirect: '/signup',
		failureFlash: true
	}))

	app.get('/main', controllers.authCtrl.isLoggedIn, controllers.userCtrl.getMain);

	app.get('/', function(req, res) {
		res.render('index.ejs');
	})
}