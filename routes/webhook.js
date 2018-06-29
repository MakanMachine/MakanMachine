var express = require('express');
var router = express.Router();
var tgCaller = require('../api_caller/telegram_caller');
var eventHandler = require('../handlers/eventHandler');

/* GET home page. */
router.post('/', function(req, res) {
	const objectBody = req.body;
	console.log('received message from telegram', JSON.stringify(objectBody));
	res.status(200).send("All's Good");
	eventHandler.handleTgEvent(objectBody);
});

module.exports = router;
