var Subscriber = require("../data/Subscriber");

module.exports = {
	subscribe: subscribe,
	unsubscribe: unsubscribe
};

function subscribe(req, res, next) {
	var data = req.body,
		storage = req.storage;

	if(!data.email || !data.keywords) {
		res.status(400);
		res.end("Missing subscibers email or keywords!")
		return;
	}

	Subscriber.addSubscriber(data, storage).then(function(subscriberInfo) {
		res.send(JSON.stringify(subscriberInfo));
		next();
	}, function(err) {
		console.log("Error: " + err);
		res.send(500);
		next();
	})
};

function unsubscribe(req, res, next) {
	var data = req.body,
		storage = req.storage;

	if(!data.subscriberId) {
		res.status(400);
		res.end("Missing subscriberId!");
		return;
	}

	Subscriber.removeSubscriber(data, storage).then(function() {
		res.send(200);
		next();
	}, function(err) {
		console.log("Error: " + err);
		res.send(500);
		next();
	})
};