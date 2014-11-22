(function() {
	"use strict";
	angular.module('app').factory('auth', ["$http", "$q", "identity", "UsersResource", auth])

	function auth($http, $q, identity, UsersResource) {
		return {
			signup: function(user) {
				var deferred = $q.defer();
				var user = new UsersResource(user);
				user.$save().then(function() {
					identity.currentUser = user;
					deferred.resolve();
				}, function(response) {
					deferred.reject(response);
				});
				return deferred.promise;
			},
			login: function(user) {
				var deferred = $q.defer();

				$http.post('/login', user).success(function(response) {
					if (response.success) {
						var user = new UsersResource();
						angular.extend(user, response.user);
						identity.currentUser = user;
						deferred.resolve(true);
					} else {
						deferred.resolve(false);
					}
				});

				return deferred.promise;
			},
			logout: function() {
				var deferred = $q.defer();

				$http.post('/logout').success(function(response) {
					identity.currentUser = undefined;
					deferred.resolve(true);
				});

				return deferred.promise;
			},
			isAuthenticated: function() {
				if (identity.isAuthenticated()) {
					return true;
				} else {
					return $q.reject("not authorized");
				}
			}
		}
	};
}());