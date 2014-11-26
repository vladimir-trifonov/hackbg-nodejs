(function() {
	"use strict";
	angular.module('app').factory('SnippetsResource', ["$resource", SnippetsResource])

	function SnippetsResource($resource) {
		var SnippetsResource = $resource('/api/snippets/:id', {
			_id: '@id'
		}, {save: {method: 'PUT', isArray: false}, update: {method: 'POST', isArray: false}});
		
		return SnippetsResource;
	};
}());