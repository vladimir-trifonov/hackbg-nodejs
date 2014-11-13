var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var groupSchema = new Schema({
    "groupName": { type: Schema.Types.Mixed, default: null, required: true },
    "type": { type: String, default: null },
	"contacts" : [String]
}, { strict: true, w: "majority" });
mongoose.model('Group', groupSchema);

