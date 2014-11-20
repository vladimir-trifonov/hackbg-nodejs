var controllers = require('../controllers')

module.exports = function(app) {
	app.post('/createGraphFor', controllers.mainCtrl.addGraph, controllers.gitUserCtrl.createGraphFor);
	app.get('/graph/:graphId', controllers.mainCtrl.getGraph);
	app.get('/mutually_follow/:graphId/:username', 
		controllers.mainCtrl.checkIfExists, 
		controllers.mainCtrl.loadGraph,
		controllers.gitUserCtrl.mutuallyFollow );
}