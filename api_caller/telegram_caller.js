const request = require('request');
const axios = require('axios');
const async = require('async');

async function postToTelegram(tgMethod, payload) {
	try {
		const response = await axios({
			url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/${tgMethod}`,
			method: 'post',
	 		headers: {'content-type': 'application/json'},
	 		data: payload,
		});
		if (response.status !== 200) {
      		throw new Error(JSON.stringify(response.data));
    	}
    	return JSON.stringify(response.data);
  	} catch (error) {
    	throw new Error(error);
	}
}

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

async function sendMessage(chatID, message, option) {
	console.log("Sending message to chat_id" + chatID);
	let parseMode = '';
	let replyMarkup = {};
	if (option) {
		parseMode = option.parse_mode || '';
		replyMarkup =
			option.force_reply ||
			option.inline_keyboard ||
			option.keyboard ||
			option.remove_keyboard ||
			{};
	}
	const payload = {
		chat_id: chatID,
		text: message,
		parse_mode: parseMode,
		reply_markup: replyMarkup,
	};
	try {
		const result = await postToTelegram('sendMessage', payload);
		console.log(`Message sent to ${chatID}. ${result}`);	
	} catch (error) {
		throw new Error(`Failed to send message to ${chatID}. ${error}`);
	}	
}

async function sendMessageWithInlineKeyboard(chatID, message, inlineKeyboardButtonList) {
	console.log('Sending message with inline keyboard: ', chatID);
	const sendOptions = {
		parse_mode: 'markdown',
		inline_keyboard: {
			inline_keyboard: inlineKeyboardButtonList,
		},
	};
	await sendMessage(chatID, message, sendOptions);
}

async function sendMessageWithForcedReply(chatID, message) {
	console.log('Forcing reply for preference: ', chatID);
	await sendMessage(chatID, message, {
		parse_mode: 'markdown',
		force_reply: {force_reply: true },
	});
}

module.exports = {
	setWebHook,
	sendMessage,
	sendMessageWithInlineKeyboard,
	sendMessageWithForcedReply,
}