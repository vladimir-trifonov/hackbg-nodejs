var controllers = require('../controllers')

module.exports = function(app, storage) {	
	app.get('/keywords', controllers.dataCtrl.getKeywords);
}