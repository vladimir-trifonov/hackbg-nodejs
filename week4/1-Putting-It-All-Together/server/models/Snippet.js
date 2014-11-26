var mongoose = require('mongoose');

var snippetSchema = mongoose.Schema({
    language: String,
    filename: String,
    code: String,
    creator: String
});
mongoose.model('Snippet', snippetSchema);