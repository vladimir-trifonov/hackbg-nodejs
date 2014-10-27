module.exports = {	
	getRangesArray: getRangesArray
}

function RangeArray() {
	this.ranges = [];
}

RangeArray.prototype.addRange = function(range) {
	this.ranges.push(range);
}

RangeArray.prototype.getRange = function() {
	var range = this.ranges.shift();
	return range;
}

RangeArray.prototype.hasRange = function() {
	return this.ranges.length > 0;
}

function getRangesArray(from, to, step) {
	var rangeArray = new RangeArray();
	for(var i = from, k = i + step; k < to; i += step, k += step) {
		rangeArray.addRange([i, k]);
	}
	rangeArray.addRange([i, to]);

	return rangeArray;
}