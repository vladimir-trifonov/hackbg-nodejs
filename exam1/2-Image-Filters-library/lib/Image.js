function Image(imageIn, imageType, kernel) {
	this.imageIn = imageIn;
	this.imageOut = [];
	this.imageType = imageType;
	this.kernel = kernel;
	this.fullSize = {
		x0: 0,
		y0: 0,
		x1: this.imageIn[0].length,
		y1: this.imageIn.length
	};

	this.init();
};

Image.prototype.init = function() {
	var iMax = this.fullSize.x1,
		jMax = this.fullSize.y1;

	for (j = 0; j < jMax; j++) {
		this.imageOut[j] = [];
		for (i = 0; i < iMax; i++) {
			this.imageOut[j][i] = 0;
		}
	}
};

Image.prototype.getPixelColor = function(x, y) {
	if(x < this.fullSize.x0 ||
		x >= this.fullSize.x1 ||
		y < this.fullSize.y0 ||
		y >= this.fullSize.y1) {
		return 0;
	}
	return this.imageIn[y][x];
};

Image.prototype.constrain = function(src, from, to) {
	return Math.round((src < from ? from : (src > to ? to : src)) * 100) / 100;
};

Image.prototype.process = function(coords) {
	var fn = 'process' + this.imageType;
	this[fn](coords);
};

Image.prototype.getImageReady = function() {
	return this.imageOut;
};

//
//There are two separate methods(rgb processing and monochrome processing) because of better performance(in monochrome).
//
Image.prototype.processmonochrome = function(coords) {
	var color,
		offset = Math.floor(this.kernel.size / 2),
		kernelSize = this.kernel.size,
		kernelValue = null;

	if(this.kernel.isNormalized) {
		kernelValue = this.kernel.value;
	}

	for (var y = coords.pointFrom.y; y <= coords.pointTo.y; y++) {
		for (var x = coords.pointFrom.x; x <= coords.pointTo.x; x++) {
			color = 0;
			for (var j = 0; j < kernelSize; j++) {
				for (var i = 0; i < kernelSize; i++) {
					var xLoc = x + i - offset,
						yLoc = y + j - offset;

					if(!this.kernel.isNormalized) {
						kernelValue = this.kernel.value[j][i];
					}
					color += this.getPixelColor(xLoc, yLoc) * kernelValue;
				}
			}
			this.imageOut[y][x] = this.constrain(color, 0, 255);
		}
	}
};

Image.prototype.processrgb = function(coords) {
	var color,
		offset = Math.floor(this.kernel.size / 2),
		kernelSize = this.kernel.size,
		kernelValue = null;

	if(this.kernel.isNormalized) {
		kernelValue = this.kernel.value;
	}

	for (var y = coords.pointFrom.y; y <= coords.pointTo.y; y++) {
		for (var x = coords.pointFrom.x; x <= coords.pointTo.x; x++) {
			color = {
				r: 0,
				g: 0,
				b: 0
			};
			for (var j = 0; j < kernelSize; j++) {
				for (var i = 0; i < kernelSize; i++) {
					var xLoc = x + i - offset,
						yLoc = y + j - offset,
						pixelValue;

					if(!this.kernel.isNormalized) {
						kernelValue = this.kernel.value[j][i];
					}

					pixelValue = this.getPixelColor(xLoc, yLoc);

					color.r += (pixelValue.r * kernelValue);
					color.g += (pixelValue.g * kernelValue);
					color.b += (pixelValue.b * kernelValue);
				}
			}
			this.imageOut[y][x].r = this.constrain(color.r, 0, 255);
			this.imageOut[y][x].g = this.constrain(color.g, 0, 255);
			this.imageOut[y][x].b = this.constrain(color.b, 0, 255);
		}
	}
};

module.exports.Image = Image;