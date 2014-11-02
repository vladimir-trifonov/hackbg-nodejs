var controllers = require('../controllers')

module.exports = function(app) {	
	app.get('/keywords', controllers.dataCtrl.getPage);
}