var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Q = require('q');

var contactSchema = new Schema({
    "phoneNumber": { type: String, required: true },
    "cw": { type: [String], index: true, required: true },
}, {
	strict: true,
	w: "majority",
	toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

contactSchema.virtual('personIdentifier').get(function() {
    return this.cw.join(' ');
});

contactSchema.methods.commonWordsToGroups = function(otherCommonWords) {
	var deferred = Q.defer(),
		commonWords = this.cw;

	if(otherCommonWords) {
		commonWords = commonWords.concat(otherCommonWords);
	}
	commonWords = commonWords.map(function(word) {
		return new RegExp('^' + word + '$', 'i');
	});

	this.model('Contact').aggregate([
    	{ $match: { cw: { $in: commonWords } } },
    	{ $unwind: "$cw" },
    	{ $project: {
    		_id: 1,
    		cw: { $toLower: "$cw" }
    	} },
    	{ $match: { cw: { $in: commonWords } } },
    	{ $group: {
    		_id: "$cw",
    		contactIds: { $push: "$_id" },
    		count: { $sum: 1 }
		} }
	], function(err, coll) {
		if(err) {
			return deferred.reject(err);
		}

		deferred.resolve(coll);
	});

	return deferred.promise;
};

contactSchema.methods.getOtherCommonWords = function() {
	var deferred = Q.defer(),
		id = this.id;

	this.model('Contact').aggregate([
    	{ $match: { _id: { $ne: new mongoose.Types.ObjectId(id) } } },
    	{ $unwind: "$cw" },
    	{ $project: {
    		cw: { $toLower: "$cw" }
    	} },
    	{ $group: {
    		_id: null,
    		commonWords: { $addToSet: "$cw" }
		} }
	], function(err, res) {
		if(err) {
			return deferred.reject(err);
		}

		if(res && res.length === 1) {
			deferred.resolve(res[0].commonWords);
		}

		deferred.resolve([]);
	});

	return deferred.promise;
};

mongoose.model('Contact', contactSchema);



