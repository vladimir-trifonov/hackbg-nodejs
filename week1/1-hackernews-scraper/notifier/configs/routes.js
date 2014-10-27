var controllers = require('../controllers')

module.exports = function(app) {
	app.get('/newArticles', controllers.notifierCtrl.notify);
}