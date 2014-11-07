var controllers = require('../controllers')

module.exports = function(app, storage) {
	app.post('/createGraphFor', controllers.mainCtrl.createGraphFor);
	app.get('/graph/:graphId', controllers.mainCtrl ?? , next);
	app.get('/mutually_follow/:graphId/:username', controllers.mainCtrl ??? );
}