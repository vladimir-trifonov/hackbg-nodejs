var User = require("../models/User"),
	config = require("../configs/config"),
	Q = require('q');

module.exports = {
	getUsersData: function() {
		var deferred = Q.defer();
		User.getUsers(config.usersPath).then(function(data) {
			var resData = {};
			if(!data) {
				deferred.resolve();
			}

			resData.proceed = true;
			resData.users = data;
			return resData;
		})
		.then(function(data) {
			var resData =  data || {};

			if(resData.proceed === true) {
				User.getConfirmedEmails(config.confirmedEmailsPath)
					.then(function(confirmedEmails) {
							resData.confirmedEmails = confirmedEmails;
							deferred.resolve(resData);
						},
						function() {
							deferred.reject(err);
						});
			} else {
				deferred.resolve();
			}
		})
		.fail(function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}
}