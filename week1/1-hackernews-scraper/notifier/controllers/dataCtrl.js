var Q = require('q'),
	Item = require("../models/Item"),
	User = require("../models/User");

module.exports = {
	proceedData: function(data) {
		var deferred = Q.defer();

		var items = data.itemsData.items,
			proceededItems = data.itemsData.proceededItems,
			users = data.usersData.users,
			confirmedEmails = data.usersData.confirmedEmails,
			matchedData = {};

		items.forEach(function(item) {
			if (!Item.isItemProceeded(proceededItems, item)) {
				Object.keys(users).forEach(function(userKey) {
					var user = users[userKey];
					if (User.isEmailConfirmed(confirmedEmails, user) &&
						Item.isTypeMathes(item, User.getType(user))) {
						if(Item.isTitleContainKeyword(item, User.getKeywords(user))) {
							var email = User.getEmail(user);
							if(typeof matchedData[email] === "undefined") {
								matchedData[email] = [];
							}

							var resultText = Item.getResultText(item);
							matchedData[email].push(resultText);
						}
					}
				})
			}
			Item.setItemProceeded(proceededItems, item);
		});

		deferred.resolve({"resultItems": matchedData, "proceededItems": proceededItems});
		return deferred.promise;
	}
}