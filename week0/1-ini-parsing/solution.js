var fs = require('fs'),
	argv = require('minimist')(process.argv.slice(2)),
	inputCommandDataParser;

(function() {
	var src = argv['_'][0] || process.argv[2];

	if (!src) {
		throw 'Source file name missing!';
		return;
	}

	var arr = src.split('/'),
		fileName = arr[arr.length - 1],
		dest = '',
		srcType = argv.type || null;

	if (srcType === "ini" || fileName.indexOf('.ini') !== -1) {
		if (srcType === null) {
			srcType = 'ini';
			dest = src.replace('.ini', '.json');
		} else {
			dest = src + '.json';
			src += '.' + srcType;
		}
	} else if (srcType === "json" || fileName.indexOf('.json') !== -1) {
		if (srcType === null) {
			srcType = 'json';
			dest = src.replace('.json', '.ini');
		} else {
			dest = src + '.ini';
			src += '.' + srcType;
		}
	}

	if (!srcType) {
		throw 'Source file type missing!'
		return;
	}

	if (srcType === 'ini') {
		parseIniFileToJSON(src, function(err, data) {
			if (err) {
				throw err;
				return;
			}

			saveDataToFile(JSON.stringify(data, null, 4), dest);
		})
	} else if (srcType === 'json') {
		parseJSONFileToIni(src, function(err, data) {
			if (err) {
				throw err;
				return;
			}

			saveDataToFile(data, dest);
		})
	}
})();

function parseIniFileToJSON(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		if (err) {
			return callback(err, null);
		}

		var strArr = data.split("\r"),
			resArr = [],
			resObj = {},
			currentKey = null;
		strArr.forEach(function(line) {
			line = line.trim();
			if (line === '' || line === '\r' || line.indexOf(';') === 0) {
				return;
			} else if (line.indexOf('[') === 0) {
				currentKey = line.replace(/\[|\]/g, '');
				resObj[currentKey] = {};
			} else {
				if (currentKey === null) {
					throw 'Parse Err!';
				}

				var keyValuePair = line.split("="),
					subKey = keyValuePair[0].trim(),
					subValue = keyValuePair[1].trim();
				resObj[currentKey][subKey] = subValue;
			}
		});

		callback(null, resObj);
	});
}

function parseJSONFileToIni(path, callback) {
	fs.readFile(path, 'utf8', function(err, data) {
		var jsonObj = JSON.parse(data),
			resStr = "";

		for (var key in jsonObj) {
			if (jsonObj.hasOwnProperty(key)) {
				resStr += '[' + key + ']\r';

				for (var subKey in jsonObj[key]) {
					if (jsonObj[key].hasOwnProperty(subKey)) {
						resStr += subKey + '=' + jsonObj[key][subKey] + '\r';
					}
				}
			}
		}

		callback(null, resStr);
	});
}

function saveDataToFile(data, path) {
	fs.writeFile(path, data, function(err) {
		if (err) {
			throw err;
			return;
		}
	});
}