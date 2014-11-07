var helper = require("../common/helper");

module.exports = {
	getUsers: function(path) {
		return helper.readFile(path);
	},
	getConfirmedEmails: function(path) {
		return helper.readFile(path);
	},
	isEmailConfirmed: function(confirmedEmails, user) {
		var email = user.email;

		if(confirmedEmails[email] === true) {
			return true;
		}

		return false;
	},
	getType: function(user) {
		return user.type;
	},
	getKeywords: function(user) {
		return user.keywords;
	},
	getEmail: function(user) {
		return user.email;
	}
}
