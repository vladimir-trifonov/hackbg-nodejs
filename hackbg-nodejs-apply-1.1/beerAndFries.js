"use strict";

exports.beerAndFries = function(items) {
	var arrObj = {},
		currObj = null,
		resArr = [],
		resSum = 0;

	items.forEach(function(item) {
		if (currObj === null) {
			currObj = item.type;
		}

		if (typeof arrObj[item.type] === "undefined") {
			arrObj[item.type] = [];
		}

		arrObj[item.type].push(item.score);

		for (var arrKey in arrObj) {
			if (arrKey !== item.type && arrObj.hasOwnProperty(arrKey)) {
				var curArr = arrObj[arrKey];

				curArr.forEach(function(itemScore, index) {
					var currScore = itemScore * item.score;
					var sumObj = {};
					sumObj[arrKey] = index;
					sumObj[item.type] = arrObj[item.type].length - 1;
					resArr.push({ "sum": currScore, "indexes": sumObj});
				})
			}
		}
	});

	resArr.sort(function(a, b){return b["sum"]-a["sum"]});

	resArr.forEach(function(item) {
		var indexes = item.indexes,
			sourceArraysIndexes = [],
			isSumSourcesExists = true;

		if(item.sum !== 0) {
			for (var key in indexes) {
				if (indexes.hasOwnProperty(key)) {
					if(arrObj[key][indexes[key]] === null) {
						isSumSourcesExists = false;
					}
				}
			}

			if(isSumSourcesExists) {
				for (var key in indexes) {
					if (indexes.hasOwnProperty(key)) {
						arrObj[key][indexes[key]] = null;
					}
				}
				resSum += item.sum;
			}
		}
	});

	return resSum;
}