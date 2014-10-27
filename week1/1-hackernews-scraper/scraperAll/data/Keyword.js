var Q = require('q'),
	natural = require('natural'),
	tokenizer = new natural.WordTokenizer(),
	filesHelper = require("../common/filesHelper"),
	histogramFilePath = "../histogram.json";

module.exports = {
	countKeywords: function(items, storage) {
		var deferred = Q.defer(),
			source = '';

		items.forEach(function(data) {
			var item = null;
			try {
				item = JSON.parse(data);
			} catch (e) {
				return;
			}

			if (item.title) {
				source = item.title;
			} else if (item.text) {
				source = item.text;
			}
			var words = tokenizer.tokenize(source);

			words.forEach(function(word) {
				var wordInfo = storage.getItem(word);
				if (!wordInfo) {
					wordInfo = {};
					wordInfo[word] = 0;
				}
				wordInfo[word] += 1;
				storage.setItem(word, wordInfo)
			});

			storage.persistSync();
			storage.values(function(vals) {
				deferred.resolve(vals);
			});
		});

		return deferred.promise;
	},
	saveKeywordsCountsToFile: function(vals) {
		var deferred = Q.defer();
		filesHelper.writeToFile(histogramFilePath, JSON.stringify(vals), function(err) {
			if(err) {
				console.log(err);
			}
			
			deferred.resolve();
		});
		return deferred.promise;
	}
}