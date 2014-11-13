var mapCtrl = require('../controllers/mapCtrl');

module.exports = function(app, storage) {
	app.post('/map', mapCtrl.checkHasMap, mapCtrl.startCrawl);
	app.get('/sitemap/:id', mapCtrl.checkMapReady, mapCtrl.getSiteMap);
}