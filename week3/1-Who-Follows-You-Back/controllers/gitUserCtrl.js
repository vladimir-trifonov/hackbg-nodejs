var newUser = (function() {
	return function(name) {
		var options = getDefaultOptions();
		options.visited[name] = true;

		var gitUser = new GitUser(name, options);
		initGitUserEventHandlers(gitUser);

		addThread.call(gitUser, gitUser.getThreadId());
		gitUser.run();

		return gitUser;
	}
})();

function initGitUserEventHandlers(gitUser) {
	gitUser.on('chunk', function(data) {
		var self = this;
		process.nextTick(function() {
			graphCtrl.createEdges(self.options.graph, self.name, data);
		});

		if (this.proceedNeighbors === false) {
			return;
		}

		if (this.proceedNeighbors === null && (this.getOption('currentGraphDepth') < this.getOption('maxGraphDepth'))) {
			this.incOption('currentGraphDepth');
			this.proceedNeighbors = true;
		} else {
			this.proceedNeighbors = false;
		}

		if (this.proceedNeighbors === true) {
			data.forEach(function(neighbor) {
				var neighborName = neighbor.login;
				if (neighborName && !self.options.visited[neighborName]) {
					self.options.visited[neighborName] = true;
					newUser(neighborName);
				}
			})
		}
	});

	gitUser.on('completed', function(threadId) {
		threadCompleted.call(gitUser, threadId);
		saveOnAllCompleted.call(gitUser);
	});
};