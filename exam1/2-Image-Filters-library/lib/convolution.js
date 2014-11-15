var Q = require('q'),
	Runner = require('./Runner').Runner;

var edgeDetectionKernel = {
		isNormalized: false,
		size: 3,
		value: [
			[-1, -1, -1],
			[-1, 8, -1],
			[-1, 1, -1]
		]
	},
	boxBlurKernel = {
		isNormalized: true,
		size: 3,
		value: 1 / 9
	};

module.exports.monochrome = function(imageData, kernel) {
	return applyKernel(imageData, "monochrome", kernel);
};

module.exports.rgb = function(imageData, kernel) {
	return applyKernel(imageData, "rgb", kernel);
};

module.exports.monochrome.edgeDetection = function(imageData) {
	return applyKernel(imageData, "monochrome", edgeDetectionKernel);
};

module.exports.monochrome.boxBlur = function(imageData) {
	return applyKernel(imageData, "monochrome", boxBlurKernel);
};

module.exports.monochrome.applyKernel = function(imageData, kernel) {
	return applyKernel(imageData, "monochrome", kernel);
};

module.exports.rgb.edgeDetection = function(imageData) {
	return applyKernel(imageData, "rgb", edgeDetectionKernel);
};

module.exports.rgb.boxBlur = function(imageData) {
	return applyKernel(imageData, "rgb", boxBlurKernel);
};

module.exports.rgb.applyKernel = function(imageData, kernel) {
	return applyKernel(imageData, "rgb", kernel);
};

function applyKernel(imageData, imageType, kernel) {
	var deferred = Q.defer();

	if (!imageData || !kernel) {
		deferred.reject();
	} else {
		var isKernelNormalized = isNormalized(kernel),
			kernelValue = null;

		if(isKernelNormalized) {
			kernelValue = kernel[0][0];
		} else {
			kernelValue = kernel;
		}
		var runner = new Runner(imageData, imageType, {
			value: kernel.value || kernelValue,
			isNormalized: kernel.isNormalized || isKernelNormalized,
			size: kernel.size || kernel.length
		});

		runner.once('ready', function(imageOut) {
			deferred.resolve(imageOut);
			runner = null;
		});

		setImmediate(function() {
			runner.process();
		});
	}

	return deferred.promise;
};

function isNormalized(kernel) {
	var kernelSize = kernel.length,
		value = kernel[0][0];

	for (var j = 0; j < kernelSize; j++) {
		for (var i = 0; i < kernelSize; i++) {
			if(kernel[j][i] !== value) {
				return false;
			}
		}
	}
	return true;
}