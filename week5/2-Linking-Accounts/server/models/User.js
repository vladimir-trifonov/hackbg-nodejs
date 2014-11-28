var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    github: {
        id: String,
        token: String,
        email: String,
        name: String
    },
	facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    }
});

module.exports = mongoose.model('User', userSchema);