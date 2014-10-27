var http = require('http');
var routesHanlers = {};

module.exports = function() {
	function registerRoute(method, url, callback) {
		if (!routesHanlers[method]) {
			routesHanlers[method] = {};
		}

		routesHanlers[method][url] = callback;
	}

	var get = function(url, callback) {
		registerRoute('GET', url, callback);
	}

	var post = function(url, callback) {
		registerRoute('POST', url, callback);
	}

	var deleteFn = function(url, callback) {
		registerRoute('DELETE', url, callback);
	}	

	var listen = function(port) {
		http.createServer(function(req, res) {
			var payload = "";
			var routeHandler = routesHanlers[req.method][req.url];
			
			res.send = function(data, port) {
				res.writeHead(port || 200, "OK", {
					'Content-Type': 'text/html'
				});
				res.end(data);
			}

			req.on('data', function(chunk) {
				payload += chunk.toString();
			});

			req.on('end', function() {
				if (routeHandler) {
					try {
						var fixedResponse = payload.replace(/\\'/g, "'");
						req.body = JSON.parse(fixedResponse);
					} catch(e) {}
					
					routeHandler(req, res);
				}

			});
		}).listen(port);
	}


	return {
		get: get,
		post: post,
		'delete': deleteFn,
		listen: listen
	}
}