var jsonsafeparse = require('json-safe-parse');

module.exports = {
	parseJSON: function(input) {
		return jsonsafeparse(input, 'ignore');
	}
}