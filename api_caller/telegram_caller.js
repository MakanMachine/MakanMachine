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
				url: `${process.env.APP_SECURE_URL}/bot${process.env.BOT_TOKEN}`,				
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
		parse_mode: 'Markdown',
		inline_keyboard: {
			inline_keyboard: inlineKeyboardButtonList,
		},
	};
	await sendMessage(chatID, message, sendOptions);
}

async function sendMessageWithForcedReply(chatID, message) {
	console.log('Forcing reply for preference: ', chatID);
	await sendMessage(chatID, message, {
		parse_mode: 'Markdown',
		force_reply: {force_reply: true },
	});
}

async function sendMessageWithReplyKeyboard(chatID, message, replyKeyboardButtonList) {
	console.log('Sending message with reply keyboard:', chatID);
	const sendOptions = {
		parse_mode: 'Markdown',
		keyboard: {
			keyboard: replyKeyboardButtonList,
			one_time_keyboard: true,
			resize_keyboard: true,
		},
	};
	await sendMessage(chatID, message, sendOptions);
}

async function sendMessageWithReplyKeyboardRemoved(chatID, message) {
	console.log('Sending message with reply keyboard removed:', chatID);
	const sendOptions = {
		parse_mode: 'markdown',
		remove_keyboard: {
			remove_keyboard: true,
		},
	};
	await sendMessage(chatID, message, sendOptions);
}

async function editMessageWithInlineKeyboard(chatID, msgID, editedMessage, editedInlineKeyboardButtonList) {
	 console.log('Editing message with inline keyboard:' + chatID);
	 const sendOptions = {
	 	parse_mode: 'markdown',
	 	inline_keyboard: {
	 		inline_keyboard: editedInlineKeyboardButtonList,
	 	},
	 };
	 await editMessage(chatID, msgID, editedMessage, sendOptions);
}

async function editMessage(chatID, msgID, editedMessage, options) {
	console.log(`Editing Message[${msgID}] for chat_id: ${chatID}`);
	let parseMode = '';
	let replyMarkup = {};
	if(options) {
		parseMode = options.parse_mode || '';
		replyMarkup = options.force_reply || options.inline_keyboard || {};
	}
	const payload = {
		chat_id: chatID,
		message_id: msgID,
		text: editedMessage,
		parse_mode: parseMode,
		reply_markup: replyMarkup,
	};
	try {
		const result = await postToTelegram('editMessageText', payload) 
		console.log(`Message sent to ${chatID}. ${result}`);
	} catch (error) {
		throw new Error(`Error: Failed to edit message at ${chatID}. ${error}`);
	}
}

async function sendAnswerCallbackQuery(callbackQueryID, callbackOptions) {
	console.log(`Sending answer callback query (${JSON.stringify(callbackOptions)}) to callback query: ${callbackQueryID}`);
	let payload = {
		callback_query_id: callbackQueryID,
	};
	if(callbackOptions) {
		payload = Object.assign({}, payload, callbackOptions);
	}
	try {
		const result = await postToTelegram('answerCallbackQuery', payload);
		console.log(`Answer Callback Query sent to callback_query_id: ${callbackQueryID}. ${result}`);
	} catch (error) {
		throw new Error(`Error: Failed to send answer callback query to ${callbackQueryID}. ${error}.`);
	}
}

module.exports = {
	setWebHook,
	sendMessage,
	sendAnswerCallbackQuery,
	sendMessageWithInlineKeyboard,
	sendMessageWithForcedReply,	
	sendMessageWithReplyKeyboard,
	sendMessageWithReplyKeyboardRemoved,
	editMessageWithInlineKeyboard,
}