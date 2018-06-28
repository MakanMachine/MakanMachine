/* Module to handle events from external servers
*	Module Exported:
*	1. handleTgEvent(objectBody): For handling Telegram events
*/

const messageHandler = require('./messageHandler');
const cqHandler = require('./callbackQueryHandler');

function handleTgEvent(objectBody) {
	console.log("Handling Telegram Event");
	if(objectBody.message) {
		messageHandler.handleMessageEvent(objectBody.message);
	}
	else if(objectBody.callback_query) {
		cqHandler.handleCallbackQueryEvent(objectBody.callback_query);
	}
	else {
		console.log("unknown event detected");
	}
}

module.exports = {
	handleTgEvent,
}