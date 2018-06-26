var mongoose = require('mongoose');
var express = require('express');
var User = require('./user');

mongoose.connect('mongodb://makan_machine:!H4rdM%40kan@ds235860.mlab.com:35860/mm_user_pref');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error.'));

db.once('open', function() {
    console.log('Successfully connected to userpref.');
});

function updateUser(chatId, msgObj) {
    console.log(`Data for chatId: ${chatId} has been updated!`);
    var message = msgObj.text.split(',');
    User.findByIdAndUpdate(chatId, {_id: chatId, username: msgObj.chat.username, first_name: msgObj.chat.first_name, cuisine: message, updated_at: new Date()}, {upsert: true, setDefaultsOnInsert: true}, (err, user) => {
        if(err)
            console.log(err);
    });
}

function startUser(chatId, msgObj) {
    User.findById(chatId, (err, user) => {
        if(err)
            console.log(err);
        else
            if(user == undefined)
                createNewUser(chatId, msgObj);
    });
}

function createNewUser(chatId, msgObj) {
    User.create({
        username: msgObj.chat.username,
        _id: chatId,
        first_name: msgObj.chat.first_name,
        cuisine: [],
        created_at: new Date(),
        updated_at: new Date()
    })
    .catch((err) => {
        console.log(err);
    });
    console.log(`Username: ${msgObj.chat.username} created. ChatId: ${chatId}.`);
}

function getUser(chatId) {
    return User.findById(chatId);
    //     , (err, user) => {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         if(user == undefined) {
    //             console.log(`ChatID: ${chatId} not found.`);
    //         } else {
    //             console.log(user);
    //             return user;
    //         }
    //     }
    // });
}

module.exports = {
    startUser,
    updateUser,
    getUser,
};