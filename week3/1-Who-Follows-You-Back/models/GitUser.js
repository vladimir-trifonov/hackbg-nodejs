var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var gitUserSchema = new Schema({
    "name": { type: String, unique: true },
    "status": String,
    "followings": []
}, { strict: true, w: "majority" });
mongoose.model('GitUser', gitUserSchema);