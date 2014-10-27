var MongoClient = require('mongodb').MongoClient,
	config = require('./config'),
	dataService = require('./dataService');

config.getValue('mongoConnectionUrl').done(function(mongoUrl) {
	MongoClient.connect(mongoUrl, function(err, db) {
		dataService.getData().done(function(data) {
			config.getValue('collectionSrc').done(function(srcPath) {
				var collectionName = srcPath.replace('./', '').replace('.json', '');
				var collection = db.collection(collectionName);

				collection.find({}).toArray(function(err, docs) {
					if (err) {
						return err;
					}
					//collection.remove({}, function() {});					
					if (docs.length === 0) {
						collection.insert(data, function(err, result) {
							console.log(err);
							console.log(result);

							db.close();
						});
					}
				})
			})
		});


	});
})