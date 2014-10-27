var helper = require("../common/helper"),
	dataCtrl = require("./dataCtrl"),
	notifyCtrl = require("./notifyCtrl"),
	callInProgress = false;

module.exports = {
	pollNewsStoreDataAndNotify: function() {
		helper.repeatEvery(function() {
			if(!callInProgress) {
				callInProgress = true;
				pollNewsStoreDataAndNotify();
			}

		}, 120 * 1000);
	}
}

function pollNewsStoreDataAndNotify() {
	dataCtrl.pollNews().then(dataCtrl.storeData).then(notifyCtrl.notify, function() {
		callInProgress = false;
	}).then(function() {
		callInProgress = false;
	},
	function(err) {
		callInProgress = false;
		console.log(err);
	});
}