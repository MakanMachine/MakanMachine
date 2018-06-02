const mongoose = require('mongoose');
const express = require('express');

exports.start = function() {
    mongoose.connect('mongodb://makan_machine:!H4rdM%40kan@ds235860.mlab.com:35860/mm_user_pref');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error.'));

    db.once('open', function() {
        console.log('Successfully connected.');

        var userSchema = mongoose.Schema({
        username: String,
        chatid: String,
        first_name: String,
        cuisine: String,
        created_at: Date,
        updated_at: Date
        });

        var User = mongoose.model('User', userSchema, 'User');
    });
}

function createNewUser(username, chatid, first_name, cuisine) {
    User.create({
        username: username,
        chatid: chatid,
        first_name: first_name,
        cuisine: cuisine,
        created_at: new Date(),
        updated_at: new Date()
    });
}

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