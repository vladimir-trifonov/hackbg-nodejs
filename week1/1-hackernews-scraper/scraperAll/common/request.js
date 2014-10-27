var http = require("http"),
	https = require("https");

module.exports = function(options, data, callback) {
	var prot = options['port'] == 443 ? https : http;
	var req = prot.request(options, function(res) {
		var output = "";

		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			output += chunk.toString();
		});
		res.on('end', function() {
			callback(null, output);
		});
	});

	req.on('error', callback);
	if (data !== null) {
		req.write(post);
	}

	req.end();
}