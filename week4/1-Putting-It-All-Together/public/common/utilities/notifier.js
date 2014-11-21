(function() {
	"use strict";
	angular.module('common.utilities').factory('notifier', [notifier])

	function notifier() {
		return {
			success: function(msg) {
				toastr.success(msg);
			},
			error: function(msg) {
				toastr.error(msg);
			}
		}
	};
}());