(function() {
	angular.module('common.services').factory("snipetsResource", ["$resource", snipetsResource]);

	function snipetsResource($resource) {
		return $resource('/api/snipets/:snipetId', {
			_id: '@snipetId'
		});
	}
}());