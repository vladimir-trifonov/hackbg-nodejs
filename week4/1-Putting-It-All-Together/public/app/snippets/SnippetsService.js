(function() {
	"use strict";
	angular.module('app').factory('SnippetsService', ["$resource", "SnippetsResource", "$q", SnippetsService])

	function SnippetsService($resource, SnippetsResource , $q) {
		return {
			addSnippet: function(snippet) {
				var deferred = $q.defer();
				var snippet = snippet;

				snippet = new SnippetsResource(snippet);
				snippet.$save().then(function() {
					deferred.resolve();
				}, function(response) {
					deferred.reject(response);
				});
				return deferred.promise;
			}
		}
	};
}());