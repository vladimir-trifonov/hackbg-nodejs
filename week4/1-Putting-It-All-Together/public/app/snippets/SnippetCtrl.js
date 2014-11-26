(function() {
	"use strict";
	angular.module('app').controller('SnippetCtrl', ["$scope", "SnippetsService", "notifier", SnippetCtrl])

	function SnippetCtrl($scope, SnippetsService, notifier) {
		$scope.snippet = {};
		$scope.addSnippet = function(snippet) {
			SnippetsService.addSnippet(snippet).then(function() {
				notifier.success('Success!');				
			})
		}
	};
}());