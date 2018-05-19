var express = require('express');
var router = express.Router();
var tgCaller = require('../api_caller/telegram_caller');

/* GET home page. */
router.post('/', function(req, res, next) {
	const objectBody = req.body;
	console.log('received message from telegram', JSON.stringify(objectBody));
	res.status(200).send('Rubbish');
	let chat_id = objectBody.message.chat.id;
	let message = objectBody.message.text;
	tgCaller.sendMessage(chat_id, message);
});

router.get('/help', function(req, res) {
    const objectBody = req.body;
    console.log('received /help from telegram');
    res.status(200).send('Help');
    let chat_id = objectBody.message.chat.id;
    tgCaller.sendMessage(chat_id, 'Makan Machine recommends you places to eat based on criteria that you decide! Type /recommend to begin.');
});

module.exports = router;
