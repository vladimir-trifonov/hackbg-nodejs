var controllers = require('../controllers');

module.exports = function(app, express) {
	var router = express.Router();

	router.post('/contacts', controllers.contactsCtrl.addContact, controllers.groupsCtrl.checkAddGroup);
	router.get('/contacts/:contact_id', controllers.contactsCtrl.getContact);
	router.get('/contacts/', controllers.contactsCtrl.getAllContacts);
	router.get('/groups/', controllers.groupsCtrl.getAllGroups);
	router['delete']('/contacts/:contact_id', controllers.contactsCtrl.removeContact);
	// router['delete']('/contacts/', controllers.contactsCtrl.removeAll, controllers.groupsCtrl.removeAll);

	app.use('/api', router);
}