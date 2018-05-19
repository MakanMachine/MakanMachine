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

module.exports = router;
