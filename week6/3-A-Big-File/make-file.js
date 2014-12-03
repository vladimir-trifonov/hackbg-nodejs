var argv = require('minimist')(process.argv.slice(2)),
	fs = require('fs'),
	os = require('os'),
	Q = require('q'),
	SumTranform = require('./transform').SumTranform;;

var size = 5000,
	output = './output.src',
	inputSize;

if (typeof argv.size !== "undefined") {
	inputSize = argv.size.toLowerCase();
	if (inputSize.indexOf('gb') !== -1) {
		size *= 1000;
	}
	inputSize = replaceAll(inputSize, {
		'mb': '',
		'gb': ''
	});
	size *= parseInt(inputSize, 10);
}

if (typeof argv.output !== "undefined") {
	output = argv.output;
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

var sum = 0;

function readAndCalc(fn) {
	var sumFormatter = createFormatter();

	var stream = fs.createReadStream(output)
		.pipe(sumFormatter);

	sumFormatter.on(
		"unpipe",
		function handleEndEvent() {
			console.dir(this.res.toString());
		}
	);
}

function createFormatter() {
	var parser = new SumTranform({
		objectMode: true
	});
	return parser;
}

function genFile(fn, size) {
	var deferred = Q.defer();
	var writeStream = fs.createWriteStream(fn, {
		flags: 'w'
	});

	var bytesCount = 0;
	var resource = genNums(size >= 1000000 ? 200 : 1);
	while (bytesCount < size) {
		bytesCount += (size >= 1000000 ? 1000000 : 5000);
		writeStream.write(resource);
	}
	writeStream.on('finish', function() {
		deferred.resolve();
	});
	writeStream.end();
	return deferred.promise;
}

function genNums(multiplier) {
	var cnt = 0;
	var num = parseInt(Math.random().toString().replace('.', ''), 10);
	var res = '';
	while (cnt < 5000 * multiplier) {
		cnt++;
		for (var i = 0; i < 10; i++) {
			num += i;
			res += num;
			if (i >= 0 && i < 9) {
				res += ', ';
			}
		}

		res += os.EOL;
	};
	return res;
}

function replaceAll(str, mapObj) {
	var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

	return str.replace(re, function(matched) {
		return mapObj[matched.toLowerCase()];
	});
}