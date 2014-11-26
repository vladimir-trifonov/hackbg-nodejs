var Snippet = require('mongoose').model('Snippet'),
	sanitize = require('mongo-sanitize');

module.exports = {
	create: function(req, res, next) {
		var data = req.body;
		var userId = req.user._id;

		if (typeof data.code === "undefined" ||
			typeof data.filename === "undefined" ||
			typeof data.language === "undefined") {
			return res.send(400);
		}

		var newSnippet = new Snippet({
			filename: data.filename,
			creator: userId,
			code: data.code,
			language: data.language
		});

		newSnippet.save(function(err, snippet) {
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
		var userId = req.user._id;

		if (!req.params.snippet_id) {
			return res.send(400);
		}

		var id = sanitize(data.req.params.snippet_id);

		Snippt.update({
				_id: id,
				creator: userId
			}, {
				$set: data
			},
			function(err, snippet) {
				if (err) {
					return next(new Error('The snippet could not be updated!'));
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
		var userId = req.user._id;

		Snippet.remove({
				_id: id,
				creator: userId
			},
			function(err, snippet) {
				if (err) {
					return next(new Error('The snippet could not be removed!'));
				}

				res.json({
					success: true
				});
			});
	},
	read: function(req, res, next) {
		var userId = req.user._id;

		if (req.params.snippet_id) {
			var id = sanitize(req.params.snippet_id);

			Snippet.findOne({
					_id: id,
					creator: userId
				},
				function(err, snippet) {
					if (err) {
						return next(new Error('The snippet could not be loaded!'));
					}

					res.json({
						success: true,
						data: snippet
					});
				});
		} else {
			Snippet.find({
					creator: userId
				},
				function(err, snippets) {
					if (err) {
						return next(new Error('The snippets could not be loaded!'));
					}

					res.json({
						success: true,
						data: snippets
					});
				});
		}
	}
}