/* Modules to handle message events from Telegram
*	Module Exported:
*		1. handleMessageEvent(msgObj): Handles Telegram Message Event
*/

const tgCaller = require('../api_caller/telegram_caller');
const cmdHandler = require('./commandHandler');
const rpHandler = require('./replyHandler');
const locHandler = require('./locationHandler');
const is = require('is_js');
const dfCaller = require('../api_caller/dialogflowCaller');
const intHandler = require('./intentHandler');

async function handleMessageEvent(msgObj) {
	console.log("Handling Telegram Message Event");
	const chatID = msgObj.chat.id;
	let text = msgObj.text;
	if(isLocation(msgObj)) {
		console.log("Location detected");
		locHandler.handleLocation(chatID, msgObj);
	} else if(text) {
		text = text.trim();
		if (isReply(msgObj)) {
			console.log("Reply Detected");
			rpHandler.handleReply(chatID, msgObj);
		} else if (isCommand(text)) { 
			const command = text.substr(1);
			console.log("Command Detected: " + command);
			cmdHandler.handleCommand(chatID, msgObj, command);
		} else if (isNotLocation(text)) {
			console.log("Reply to not use location detected");
			rpHandler.handleNoLocationReply(chatID, msgObj);
		} else if (isRecommendType(text)) {
			rpHandler.handleRecommendReply(chatID, text);
		} else {
				console.log('Natural Language Detected:', text);
	      	try {
	        	let dfQueryResult = {};
	        	dfQueryResult = await dfCaller.postMessage(chatID, text);
	        	intHandler.handleIntent(chatID, dfQueryResult, text, msgObj);
	      	} catch (error) {
	        	console.log(error);
	      	}
		}
	} else {
		console.log("Unhandled Message Event received: " + msgObj);
	}
}

function isCommand(text) {
	if(text.charAt(0) == '/') {
		return true;
	}
	else {
		return false;
	}
}

function isReply(msgObj) {
	if(msgObj.reply_to_message) {
		return true;
	}
	else {
		return false;
	}
}

function isLocation(msgObj) {
	return is.propertyDefined(msgObj, 'location');
}

function isNotLocation(text) {
	if(text == 'No, thanks') {
		return true;
	} else {
		return false;
	}
}

function isRecommendType(text) {
	if(text == 'MRT' || text == 'Cuisine')
		return true;
	else
		return false;
}

module.exports = {
	handleMessageEvent,
}