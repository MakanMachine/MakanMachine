var mongoose = require('mongoose');
var express = require('express');
var User = require('./user');

mongoose.connect('mongodb://makan_machine:!H4rdM%40kan@ds235860.mlab.com:35860/mm_user_pref');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error.'));

db.once('open', function() {
    console.log('Successfully connected.');
});

function updateUser(msgObj) {
    console.log("Data has been updated!");
    var message = msgObj.text.split(',');
    User.findByIdAndUpdate(msgObj.chat.id, {cuisine: [message[0], message[1], message[2]]}, {upsert: true}, (err, user) => {
        if(err)
            console.log(err);
    });
}

function startUser(chatId, msgObj) {
    User.findById(chatId, (err, user) => {
        if(err)
            console.log(err);
        else
            if(typeof user == 'undefined')
                createNewUser(chatId, objectBody);
    });
}

function createNewUser(chatId, firstName, msgObj) {
    User.create({
        username: msgObj.chat.username,
        _id: chatId,
        first_name: firstName,
        cuisine: [],
        created_at: new Date(),
        updated_at: new Date()
    });
    console.log(`Username: ${msgObj.chat.username} created. ChatId: ${chatId}.`);
}

module.exports = {
    startUser,
    updateUser,
};

// db.once('open', function() {
//     console.log('Successfully connected.')

//     var userSchema = mongoose.Schema({
//         username: String,
//         first_name: String,
//         cuisine: String,
//         created_at: Date,
//         updated_at: Date
//     });

//     var User = mongoose.model('User', userSchema, 'User');

//     User.create({
//         username: 'test',
//         first_name: 'te',
//         cuisine: "test cuisine",
//         created_at: new Date(),
//         updated_at: new Date()
//     });
// });