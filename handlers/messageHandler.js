/* Modules to handle message events from Telegram
*	Module Exported:
*		1. handleMessageEvent(msgObj): Handles Telegram Message Event
*/

const tgCaller = require('../api_caller/telegram_caller.js');
const cmdHandler = require('./commandHandler');

function handleMessageEvent(msgObj) {
	console.log("Handling Telegram Message Event");
	const chatID = msgObj.chat.id;
	let text = msgObj.text;
	if(text) {
		text = text.trim();
		if(isCommand(text)) {
			const command = text.spilt[0].substr(1);
			console.log("Command Detected: " + command);
			cmdHandler.handleCommand(chatID, msgObj, command);
		}
		else {
			console.log("Echoing Message");
			tgCaller.sendMessage(chatID, text).then((result) => {
				console.log(result.message);
			}).catch((error) => {
				console.log(error);
			})
		}
	}
	else {
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

module.exports = {
	handleMessageEvent,
}