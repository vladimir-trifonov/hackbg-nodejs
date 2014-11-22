var argv = require('minimist')(process.argv.slice(2)),
	fs = require('fs'),
	os = require('os'),
	Q = require('q'),
	format = require('biguint-format');

var size = 5,
	output = './output.src';

if (typeof argv.size === "undefined") {
	size = parseInt(argv.size, 10);
}

if (typeof argv.output !== "undefined") {
	output = argv.output;
}

if (argv.size.toLowerCase().indexOf('gb') !== -1) {
	size *= 1000000;
} else if (argv.size.toLowerCase().indexOf('mb') !== -1) {
	size *= 1000;
} else {
	size *= 1000;
}

fs.exists(output, function(exists) {
	if (exists) {
		readAndCalc(output);
	} else {
		var promise = genFile(output, size);
		promise.done(function() {
			readAndCalc(output);
		})
	}
})

function readAndCalc(fn) {

}

function genFile(fn, size) {
	var deferred = Q.defer();
	var writeStream = fs.createWriteStream(fn, {
		flags: 'w'
	});

	var bytesCount = 0;
	var resource = genNums();
	while (bytesCount < size) {
		bytesCount += 200000;
		writeStream.write(resource);
	}
	writeStream.on('finish', function() {
		deferred.resolve();
	});
	writeStream.end();
	return deferred.promise;
}

function genNums() {
	var cnt = 0;
	var num = Math.random();
	var res = '';
	while (cnt < 1000000) {
		cnt++;
		for (var i = 0; i < 10; i++) {
			num += i;
			res += num;
			if (i > 0 && i < 9) {
				res += ', ';
			}
		}

		res += os.EOL;
	};
	return res;
}