const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
username: String,
_id: String,
first_name: String,
cuisine: {type: [String], default: []},
created_at: {type: Date, default: new Date()},
updated_at: Date
});

var User = mongoose.model('User', userSchema, 'User');

module.exports = User;