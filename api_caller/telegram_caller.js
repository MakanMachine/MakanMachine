const request = require('request');

function setWebHook() {
	console.log("Setting Webhook on Telegram");
	return new Promise(function(resolve, reject){
		const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setwebhook`;
		const options = {
			method: 'post',
			url: url,
			headers: {'content-type': 'application/json'},
			body: {
				url: `https://serene-meadow-74652.herokuapp.com/bot${process.env.BOT_TOKEN}`,				
			},
			json: true,
		};

		request(options, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				resolve('Telegram Webhook Set');
			} else {
				reject(error);
			}
		});
	});
}

function sendMessage(chatID, message) {
	console.log("Sending message to chat_id" + chatID);
	return new Promise(function(resolve, reject) {
		const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
		const options = {
			method: 'post',
			url: url,
			headers: {'content-type': 'application/json'},
			body: {
				chat_id: chatID,
				text: message,				
			},
			json: true,
		};

		request(options, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				resolve('Message Sent');
			} else {
				reject(error);
			}
		});
	});
		
}

module.exports = {
	setWebHook,
	sendMessage,
}