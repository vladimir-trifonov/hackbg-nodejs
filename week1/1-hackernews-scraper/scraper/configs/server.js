var controllers = require("../controllers");

module.exports = function(server) {
	server.on('listening', function () {
	    controllers.mainCtrl.pollNewsStoreDataAndNotify();
	});
}

