(function() {
	angular.module('common.services').factory("snippetsResource", ["$resource", snippetsResource]);

	function snippetsResource($resource) {
		return $resource('/api/snippets/:snippetId', {
			_id: '@snippetId'
		});
	}
}());