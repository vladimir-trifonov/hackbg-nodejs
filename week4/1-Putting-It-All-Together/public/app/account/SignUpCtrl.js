(function() {
	"use strict";
	angular.module('app').controller('SignUpCtrl', ["$scope", "$location", "notifier", "auth", SignUpCtrl])

	function SignUpCtrl($scope, $location, notifier, auth) {
		$scope.signup = function(user) {
			auth.signup(user).then(function() {
				notifier.success('Registration successful!');
				$location.path('/');
			})
		}
	};
}());