var Keyword = require("../models/Keyword"),
	common = require('../common/common'),
	collectionName = require('../configs/config').collectionName;

module.exports = {
	getPage: function(req, res, next) {
		var pageSize = 10,
			page = 0;
		if (req.query.pageSize) {
			pageSize = req.query.pageSize;
		}

		if (req.query.page) {
			page = req.query.page - 1;
		}

		if(page < 0) {
			page = 0;
		}

		var skip = pageSize * page;

		Keyword
			.getKeywords({
				"matches": -1
			}, skip, pageSize, req.MongoClientWrapper, collectionName)
			.then(function(data) {
				var result = [];

				var counter = pageSize * page;
				data.collection.each(function(err, item) {
					if (err) {
						return console.log("Error: " + err);
					}

					if (item !== null) {
						result.push({"rank": ++counter, "keyword": item.keyword, "count": item.matches});
					} else {
						data.close();

						common.standartResponse(res, null, { "keywords": result, "hasNext": (data.length < skip + pageSize ? false : true), "hasPrevious": (page === 0 ? false : true) });
					}
				});

			}, function(err) {
				console.log("Error: " + err);
				common.standartResponse(res, err, null);
			});
	}
};