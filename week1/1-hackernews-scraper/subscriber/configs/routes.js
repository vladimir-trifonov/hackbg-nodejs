var controllers = require('../controllers')

module.exports = function(app, storage) {
	app.post('/subscribe', controllers.subscriberCtrl.subscribe, controllers.mailCtrl.sendConfirmation, controllers.dataCtrl.saveAllDataToFiles);
	app.post('/unsubscribe', controllers.subscriberCtrl.unsubscribe, controllers.dataCtrl.saveAllDataToFiles);
	app.get('/listSubscribers', controllers.dataCtrl.listSubscribers);
	app.get('/confirm/:key', controllers.mailCtrl.confirm, controllers.dataCtrl.saveConfirmedEmailsToFile);
}