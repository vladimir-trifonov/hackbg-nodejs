var tasks = [],
	taskInAction = false,
	usersCtrl = require('./usersCtrl'),
	itemsCtrl = require('./itemsCtrl'),
	dataCtrl = require('./dataCtrl'),
	mailCtrl = require('./mailCtrl'),
	Q = require('q');

module.exports = {
	notify: function(req, res, next) {
		var newTask = new Date();
		if (tasks.length > 0) {
			tasks.shift()
		}
		tasks.push(newTask);

		if (taskInAction !== true) {
			taskInAction = true;
			runTask(tasks.shift(), req.storage);
		}
		res.end();
	}
};

function runTask(taskId, storage) {
	usersCtrl.getUsersData()
		.then(function(usersData) {
			var data = {};
			if (usersData) {
				data.proceed = true;
				data.usersData = usersData;
			} else {
				data.proceed = false;
			}

			return data;
		})
		.then(function(data) {
			var deferred = Q.defer();
			if (data.proceed === true) {
				itemsCtrl.getItemsData(storage).then(function(itemsData) {
					if (itemsData) {
						data.itemsData = itemsData;
					} else {
						data.proceed = false;
					}

					deferred.resolve(data);
				}, function(err) {
					deferred.reject(err);
				});
			} else {
				deferred.resolve();
			}

			return deferred.promise;
		})
		.then(function(data) {
			var deferred = Q.defer();
			if (data.proceed === true) {
				dataCtrl.proceedData(data).then(function(proceededData) {
					deferred.resolve(proceededData);
				}, function(err) {
					deferred.reject(err);
				})
			} else {
				deferred.resolve();
			}
			return deferred.promise;
		})
		.then(function(data) {
			var deferred = Q.defer();
			Q.when(mailCtrl.sendMails(data.resultItems), itemsCtrl.setProceededItems(storage, data.proceededItems)).then(function() {
				deferred.resolve();
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		})
		.then(function() {
			taskInAction = false;
		}, function(err) {
			console.log("Error: " + err);
			taskInAction = false;
		})
		.done(function() {
			if (tasks.length > 0) {
				taskInAction = true;
				runTask(tasks.shift(), storage);
			}
		});
}