var config = require("./config"),
	http = require("http"),
	https = require("https");

module.exports = {
	register: register,
	getall: getall,
	getself: getself,
	create: create,
	"delete": deleteFn
}

function register(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		var apiUrlParsed = parseUrlPort(config['api_url']);
		var post_data = JSON.stringify({
			"name": data['user']
		});
		var options = {
			host: apiUrlParsed['url'],
			port: apiUrlParsed['port'],
			path: '/register',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		request(options, post_data, function(err, userData) {
			if (err) {
				return callback(err);
			}

			userData['user'] = data['user'];
			saveConfig(userData, callback);
			console.log(userData);
		});
	});
}

function getall(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		var apiUrlParsed = parseUrlPort(config['api_url']);
		var options = {
			host: apiUrlParsed['url'],
			port: apiUrlParsed['port'],
			path: '/all_chirps',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		request(options, null, function(err, chirps) {
			if (err) {
				return callback(err);
			}

			console.log(chirps);
		});
	});
}

function getself(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		if (!config['user'] || !config['key']) {
			return callback("No registered user!");
		}

		var apiUrlParsed = parseUrlPort(config['api_url']);
		var post_data = JSON.stringify({
			"name": config['user'],
			"key": config['key']
		});
		var options = {
			host: apiUrlParsed['url'],
			port: apiUrlParsed['port'],
			path: '/my_chirps',
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		request(options, post_data, function(err, myChirps) {
			if (err) {
				return callback(err);
			}

			console.log(myChirps);
		});
	});
}

function create(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		if (!config['user'] || !config['key']) {
			return callback("No registered user!");
		}

		var apiUrlParsed = parseUrlPort(config['api_url']);
		var post_data = JSON.stringify({
			"chirpText": data['message'],
			"key": config['key']
		});
		var options = {
			host: apiUrlParsed['url'],
			port: apiUrlParsed['port'],
			path: '/chirp',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		request(options, post_data, function(err, chirpId) {
			if (err) {
				return callback(err);
			}

			console.log(chirpId);
		});
	});
}

function deleteFn(data, callback) {
	getConfig(function(err, config) {
		if (err) {
			return callback(err);
		}

		if (!config['chirpid']) {
			return callback("No chirpid for deletion!");
		}

		var apiUrlParsed = parseUrlPort(config['api_url']);
		var post_data = JSON.stringify({
			"chirpId": data['chirpid'],
			"key": config['key']
		});
		var options = {
			host: apiUrlParsed['url'],
			port: apiUrlParsed['port'],
			path: '/chirp',
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		request(options, post_data, function(err, response) {
			if (err) {
				return callback(err);
			}

			console.log(response);
		});
	});
}

function request(options, data, callback) {
	var prot = options['port'] == 443 ? https : http;
	var req = prot.request(options, function(res) {
		var output = "";

		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			output += chunk.toString();
		});
		res.on('end', function() {
			try {
				output = JSON.parse(output);
				callback(null, output);
			} catch (e) {
				return callback(e);
			}
		});
	});

	req.on('error', callback);
	if (data !== null) {
		req.write(post);
	}

	req.end();
}

function getConfig(callback) {
	config.getConfig(callback);
}

function saveConfig(data, callback) {
	config.saveConfig(data, callback);
}

function parseUrlPort(url) {
	var res = {};
	var portStartIndex = url.lastIndexOf(':');
	res.url = url.slice(0, portStartIndex);
	res.port = url.slice(portStartIndex + 1);

	return res;
}