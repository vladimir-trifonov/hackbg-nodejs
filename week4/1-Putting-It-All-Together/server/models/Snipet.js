var mongoose = require('mongoose');

var snipetSchema = mongoose.Schema({
    language: String,
    filename: String,
    code: String,
    creator: String
});
mongoose.model('Snipet', snipetSchema);