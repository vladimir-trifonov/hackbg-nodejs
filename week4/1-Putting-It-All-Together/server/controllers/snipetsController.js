var Snipet = require('mongoose').model('Snipet'),
	sanitize = require('mongo-sanitize');

module.exports = {
	create: function(req, res, next) {
		var data = req.body;

		if (typeof data.filename === "undefined" || typeof data.creator === "undefined") {
			return res.send(400);
		}

		var newSnipet = new Snipet({
			filename: data.filename,
			creator: data.creator,
			code: data.code,
			language: data.language
		});

		newSnipet.save(function(err, snippet) {
			if (err) {
				return next(new Error('The snippet could not be saved!'));
			}

			res.json({
				success: true,
				snippet_id: snippet.id
			});
		});
	},
	update: function(req, res, next) {
		var data = req.body;

		if (!req.params.snippet_id) {
			return res.send(400);
		}

		var id = sanitize(data.req.params.snippet_id);

		Snipet.update({
				_id: id
			}, {
				$set: data
			},
			function(err, snippet) {
				if (err) {
					return next(new Error('Snippet could not be updated!'));
				}

				res.json({
					success: true,
					snippet: snippet
				});
			});
	},
	'delete': function(req, res, next) {
		if (!req.params.snippet_id) {
			return res.send(400);
		}

		var id = sanitize(req.params.snippet_id);

		Snipet.remove({
				_id: id
			},
			function(err, snippet) {
				if (err) {
					return next(new Error('Snippet could not be removed!'));
				}

				res.json({
					success: true
				});
			});
	},
	read: function(req, res, next) {
		if (!req.params.snippet_id) {
			return res.send(400);
		}

		var id = sanitize(req.params.snippet_id);

		Snipet.findOne({
				_id: id
			},
			function(err, snippet) {
				if (err) {
					return next(new Error('Snippet could not be loaded!'));
				}

				res.json({
					success: true,
					data: snippet
				});
			});
	}
}