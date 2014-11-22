(function() {
	var app = angular.module('app', ['ngResource', 'ngRoute', 'common.services', 'common.utilities']);
	app.config(['$routeProvider', configAngular]);
	app.value('toastr', toastr);
	app.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
			if (rejection === "not authorized") {
				$location.path('/');
			}
		})
	});

	function configAngular($routeProvider) {

		var routeUserChecks = {
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
			.when('/signup', {
				templateUrl: '/partials/account/signup',
				controller: 'SignUpCtrl'
			})
			.when('/snippets', {
				templateUrl: '/partials/snippets/newsnippet',
				controller: 'SnippetCtrl'
			})
			.when('/courses', {
				templateUrl: '/partials/snippets/snippets-list',
				controller: 'SnippetsListCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});;
	};
})();