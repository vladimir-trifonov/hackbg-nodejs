var Q = require('q'),
    Sitemap = require('./Sitemap').Sitemap;

module.exports.createSitemap = createSitemap;

function createSitemap(options) {
	var deferred = Q.defer();

    var sitemap = new Sitemap(options);
    sitemap.on('ready', function(result) {
		deferred.resolve(result);
	});
    sitemap.createSitemap();

    return deferred.promise;
}

