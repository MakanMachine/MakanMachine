var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
	const objectBody = req.body;
	console.log('received message from telegram', JSON.stringify(objectBody));
	res.status(200).send('Rubbish');
});

module.exports = router;
