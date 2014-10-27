var random = require("./randomKeyGenerator");

module.exports = (function() {
	var users = [];
	var chirps = [];
	var usersKeysIndexes = {};

	var getMyChirps = function(data, callback) {
		var collection = chirps.filter(function(chirp) {
			var userId = getUserIdByUserInfo(data.name, data.key)
			return chirp.userId === userId;
		});

		collection = collection.map(function(chirp) {
			return {
				"userId": chirp.userId,
				"chirpId": chirp.id,
				"chirpText": chirp.text,
				"chirpTime": chirp.time
			}
		})

		return callback(null, collection);
	}

	var getAllUsers = function(callback) {
		var collection = users;

		collection = collection.map(function(user) {
			return {
				"user": user.name,
				"userId": user.id,
				"chirps": getChirpsCountByUserId(user.id)
			}
		})

		return callback(null, collection);
	}

	var getAllChirps = function(callback) {
		var collection = chirps.sort(function(a, b) {
			return new Date(b.time) - new Date(a.time);
		});

		collection = collection.map(function(chirp) {
			return {
				"userId": chirp.userId,
				"chirpId": chirp.id,
				"chirpText": chirp.text,
				"chirpTime": chirp.time
			}
		})

		return callback(null, collection);
	}

	var postRegister = function(data, callback) {
		if (!data || !data.name) {
			return callback("Invalid user data!");
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i]['name'] === data.name) {
				return callback("User already exists!");
			}
		}
		var user = {};
		user.name = data.name;
		user.id = users.length;
		user.key = random.getRandomKey(12);
		usersKeysIndexes[user.key] = user.id;
		users.push(user);

		return callback(null, {
			'key': user.key
		});
	}

	var postChirp = function(data, callback) {
		if (!data || !data.key) {
			return callback("Invalid chirp data!");
		}

		var userIndex = usersKeysIndexes[data.key];
		var user = users[userIndex];
		var chirpText = data.chirpText || "";

		var chirp = {};
		chirp.id = chirps.length;
		chirp.userId = user.id;
		chirp.text = chirpText;
		chirp.time = new Date();
		chirps.push(chirp);

		return callback(null, {
			'chirpId': chirp.id
		});
	}

	var deleteChirp = function(data, callback) {
		var userId = getUserIdByUserKey(data.key),
			chirpIndexForDeletion = null,
			success = null;

		chirps.some(function(item, index) {
			if (item.id === data.chirpId && item.userId === userId) {
				chirpIndexForDeletion = index;
				return true;
			}
		})

		if (chirpIndexForDeletion) {
			chirps.splice(chirpIndexForDeletion, 1);
			success = true;
		}

		success = false;

		if (success) {
			return callback(null, {
				'success': success
			});
		}
		return callback("Deletion not succeeded!", {
			'success': success
		});
	}

	var getChirps = function(data, callback) {
		var collection = chirps.filter(function(chirp) {
			if (data.userId) {
				return chirp.userId === data.userId;
			} else if (data.chirpId) {
				return chirp.id === data.chirpId;
			}
			return false;
		});
		return callback(null, collection);
	}

	return {
		getAllChirps: getAllChirps,
		getAllUsers: getAllUsers,
		getMyChirps: getMyChirps,
		postRegister: postRegister,
		postChirp: postChirp,
		deleteChirp: deleteChirp,
		getChirps: getChirps
	}

	function getChirpsCountByUserId(userId) {
		var count = 0;
		chirps.forEach(function(item, index) {
			if (item.userId === userId) {
				count++;
			}
		});
		return count;
	}

	function getUserIdByUserInfo(name, key) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].name === name && users[i].key === key) {
				return users[i].id;
			}
		}
	}

	function getUserIdByUserKey(key) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].key === key) {
				return users[i].id;
			}
		}
	}
})()