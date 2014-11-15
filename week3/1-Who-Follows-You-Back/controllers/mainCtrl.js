var GitUser = require('mongoose').model('GitUser'),
	Q = require('q');

module.exports = {
	addGraph: addGraph,
	getGraph: getGraph,
	checkIfExists: checkIfExists
};

function addGraph(req, res, next) {
	var data = req.body,
		userName = null;

	if (!data.name) {
		res.status(400);
		res.end();
		return;
	}

	userName = sanitize(data.name);

	GitUser.findOne({
		"name": userName
	}, function(err, user) {
		if (err) {
			return next(new Error(err));
		}

		if (user === null) {
			var newGitUser = new GitUser({
				name: userName,
				status: 'pending'
			});
			GitUser.save();
			res.send(newGitUser.id);

			next();
		} else {
			res.send(user.id);
		}
	})
}

function getGraph(req, res, next) {
	getGraphFromDb(req, res, next).done(function(result) {
		res.send(result);
	});
}

function checkIfExists(req, res, next) {
	var result = getGraphFromDb(req, res, next).done(function(result) {
		if(!result.data) {
			return res.send(result);
		}

		res.locals.graph = result.data.followings;
		next();
	});
}

function getGraphFromDb(req, res, next) {
	var id = null
		deferred = Q.defer();

	if (!req.params.graphId) {
		res.status(400);
		res.end();
		return;
	}

	id = sanitize(req.params.contact_id);

	GitUser.findOne({
		_id: id
	},
	function(err, gitUser) {
		if (err) {
			return next(new Error(err));
		}

		var result = {
			data: null
		};
		if (gitUser !== null) {
			if(gitUser.status === "pending") {
				result.msg = "Graph is not ready!";
			} else if(gitUser.status === "ready"){
				result.data = gitUser.followings;
			}
		} else {
			result.msg = "Graph not exists!";
		}

		deferred.resolve(result);
	});

	return deferred.promise;
}

