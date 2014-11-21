(function() {
	"use strict";
	angular.module('app').factory('UsersResource', ["$resource", UsersResource])

	function UsersResource($resource) {
		var UsersResource = $resource('/api/users/:id', {
			_id: '@id'
		});
		
		return UsersResource;
	};
}());