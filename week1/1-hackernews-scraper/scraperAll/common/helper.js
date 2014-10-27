module.exports = {
	repeatEvery: repeatEvery
}

function repeatEvery(seconds, func, errorHandler) {
	setTimeout(function() {
		func(function(err) {
			if(err) {
				errorHandler(err);
			}

			repeatEvery(seconds, func, errorHandler);
		});
	}, seconds);
}