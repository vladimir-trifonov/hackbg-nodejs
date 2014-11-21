(function() {
	var app = angular.module('app', ['ngResource', 'ngRoute', 'common.services', 'common.utilities']);
	app.config(['$routeProvider', configAngular]);
	app.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
			if (rejection === "not authorized") {
				$location.path('/');
			}
		})
	});

	function configAngular($routeProvider) {

		var routeUserChecks = {
			adminRole: {
				authenticate: function(auth) {
					return auth.isAuthorizedForRole('admin');
				}
			},
			authenticated: {
				authenticate: function(auth) {
					return auth.isAuthenticated();
				}
			}
		};

		$routeProvider
			.when('/', {
				templateUrl: '/partials/main/home',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});;
	};
})();