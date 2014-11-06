var q = require('q'),
	fs = require('fs');

var Graph = require("./graph"),
	graphCtrl = require('./graphCtrl'),
	WorkerQueue = require("./workerQueue").WorkerQueue,
	GitUser = require("./gitUser").GitUser,
	options = {
		'requestDelay': 1000,
		'maxPagesCountPerIteraction': 5,
		'maxWaitPageRequestCyclesPerUser': 20,
		'maxUserRecordsPerPage': 30,
		'maxGraphDepth': 1,
		'currentGraphDepth': 0,
		'gitAPI_Users': 'https://api.github.com/users/',
		'gitPathUrl_Following': '/following?page=',
		'graph': new Graph(),
		'WorkerQueue': WorkerQueue,
		'requestOptions': {
			headers: {
				'User-Agent': 'request'
			}
		},
		'gitAppCredentials': {
			client_id: '2f9bf92952c109ec00a1',
			client_secret: 'f1620e61e644cfd25ff2e267a373f03deb686cf0'
		},
		'db': {}
	};

var visited = {};
var initialUserName = 'muan';

visited[initialUserName] = true;

var newUser = (function() {
	return function(name) {
		var gitUser = new GitUser(name, options);
		gitUser.on('chunk', function(data) {
			var self = this;
			process.nextTick(function() {
				graphCtrl.createEdges(self.options.graph, self.name, data);
			});

			// if (this.proceedNeighbors === false) {
			// 	return;
			// }

			if (this.proceedNeighbors === null && (this.getOption('currentGraphDepth') < this.getOption('maxGraphDepth'))) {
				this.incOption('currentGraphDepth');
				this.proceedNeighbors = true;
			} else {
				this.proceedNeighbors = false;
				process.nextTick(function() {
					fs.writeFile('./graphExample.txt', graphCtrl.toString(self.options.graph), function(err) {
						if (err) {
							console.log(err);
						}
					});
				});
			}

			if (this.proceedNeighbors === true) {
				data.forEach(function(neighbor) {
					var neighborName = neighbor.login;
					if (neighborName && !visited[neighborName]) {
						visited[neighborName] = true;
						newUser(neighborName);
					}
				})
			}
		});

		gitUser.run();
		return gitUser;
	}
})();

var initialUser = newUser(initialUserName);
initialUser.setOption('currentGraphDepth', 0);