var helper = require("../common/helper"),
	Q = require('q');

module.exports = {
	getItems: function(path) {
		return helper.readFile(path);
	},
	getProceededItems: function(storage) {
		var deferred = Q.defer();
		var vals = storage.getItem('proceededItems') || [];
		deferred.resolve(vals);
		return deferred.promise;
	},
	isItemProceeded: function(proceededItems, item) {
		var itemId = null;

		if(!proceededItems) {
			return false;
		}

		if (item.children) {
			id = item.children[0].id;
		} else {
			id = item.id;
		}

		if (proceededItems.indexOf(id) !== -1) {
			return true;
		}

		return false;
	},
	isTypeMathes: function(item, types) {
		var type = null;

		if (item.children) {
			type = item.children[0].type;
		} else {
			type = item.type;
		}

		if (types.indexOf(type) !== -1) {
			return true;
		}

		return false;
	},
	isTitleContainKeyword: function(item, keywords) {
		var hasMatch = false,
			title = item.title;
		keywords.some(function(keyword) {
			if (title.indexOf(keyword) !== -1) {
				hasMatch = true;
				return true;
			}
		})

		return hasMatch;
	},
	setItemProceeded: function(proceededItems, item) {
		var itemId = null;

		if (item.children) {
			itemId = item.children[0].id;
		} else {
			itemId = item.id;
		}

		proceededItems.push(itemId);
	},
	getResultText: function(item) {
		return item;
	},
	saveProceededItems: function(storage, proceededItems) {
		storage.setItem('proceededItems', proceededItems);
	}
}