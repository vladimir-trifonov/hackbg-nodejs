(function() {
	"use strict";
	angular.module('app').factory('identity', ["$window", "UsersResource", identity])

	function identity($window, UsersResource) {
		var user;
		if ($window.bootstrappedUserObject) {
			user = new UsersResource();
			angular.extend(user, $window.bootstrappedUserObject);
		}

		return {
			currentUser: user,
			isAuthenticated: function() {
				return !!this.currentUser;
			}
		}
	};
}());