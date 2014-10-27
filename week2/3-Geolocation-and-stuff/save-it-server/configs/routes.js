var controllers = require("../controllers");

module.exports = function(app) {
	app.post('/api/location', controllers.locationsCtrl.save);
}