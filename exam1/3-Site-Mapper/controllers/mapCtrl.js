var storage = require('node-persist'),
	keygen = require("keygenerator"),
	util = require('util'),
	siteMapper = require('../lib/sitemapper'),
	fs = require('fs'),
	Url = require('url'),
	jsonsafeparse = require('json-safe-parse');;

storage.initSync({
	dir: '../../../data/storage',
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	continuous: false,
	interval: false
});

module.exports = {
	checkHasMap: function(req, res, next) {
		var data = req.body;

		if(!data.url || !data.scheme) {
			res.status(400);
			res.end("Error: Missing url or scheme!");
			return;
		}
		data.url = Url.parse(data.scheme + '://' + data.url).hostname;
		var	crawlRequestInfo = storage.getItem(data.url),
			hasMap = false;

		if (!crawlRequestInfo) {
			crawlRequestInfo = {};
			crawlRequestInfo = util._extend(crawlRequestInfo, data);
			crawlRequestInfo.id = keygen._();
			crawlRequestInfo.status = 'pending';
			storage.setItem(crawlRequestInfo.url, crawlRequestInfo);
			storage.setItem(crawlRequestInfo.id, crawlRequestInfo.url);
		} else {
			hasMap = true;
		}

		res.status(200);
		res.json({
			"id": crawlRequestInfo.id
		});

		if (!hasMap) {
			res.locals.crawlParameters = crawlRequestInfo;
			next();
		}
	},
	startCrawl: function(req, res, next) {
		var crawlParameters = res.locals.crawlParameters;
		siteMapper.createSitemap(crawlParameters)
			.done(function(result) {
				process.nextTick(function() {
					var savePath = './data/' + crawlParameters.id + '.json';
					fs.writeFile(savePath, JSON.stringify(result, null, 4), function(err) {
						if (err) {
							return console.log(err);
						}

						var crawlInfo = storage.getItem(crawlParameters.url);
						crawlInfo.status = 'ready';
						crawlInfo.filePath = savePath;
						storage.setItem(crawlParameters.url, crawlInfo);
					});
				});
			});
	},
	checkMapReady: function(req, res, next) {
		var id = req.params.id,
			url = storage.getItem(id),
			crawlRequestInfo = storage.getItem(url),
			hasMap = false;

		if (!crawlRequestInfo) {
			res.status(400).json({
				"status": "missing crawling request"
			});
		} else if (crawlRequestInfo.status === 'pending') {
			res.json({
				"status": "currently crawling"
			});
		} else if (crawlRequestInfo.status === 'ready') {
			res.locals.crawlParameters = crawlRequestInfo;
			next();
		}
	},
	getSiteMap: function(req, res, next) {
		var crawlParameters = res.locals.crawlParameters,
			result = {
				status: "done"
			};

		fs.readFile(crawlParameters.filePath, 'utf8', function(err, data) {
			if (err) {
				return console.log(err);
			}
			var sitemap = jsonsafeparse(data, 'ignore');
			result.sitemap = sitemap;
			res.status(200);
			res.json(result);
		});
	}
}
