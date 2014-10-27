var controllers = require("../controllers");
	helper = require("../common/helper");

module.exports = function(server) {
	server.on('listening', function () {
		helper.repeatEvery(2000, controllers.mainCtrl.scraperAll, function(err) {
			console.log("Error: " + err);
		});
	});
}

