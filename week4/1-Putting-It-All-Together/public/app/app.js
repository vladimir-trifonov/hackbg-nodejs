(function() {
	var app = angular.module('app', ['ngResource', 'ngRoute', 'common.services']);
	app.config(['$routeProvider', configAngular])

	function configAngular($routeProvider) {

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