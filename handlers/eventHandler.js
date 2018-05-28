/* Module to handle events from external servers
*	Module Exported:
*	1. handleTgEvent(objectBody): For handling Telegram events
*/

const messageHandler = require('./messageHandler');

function handleTgEvent(objectBody) {
	console.log("Handling Telegram Event");
	if(eventObj.message) {
		messageHandler.handleMessageEvent(objectBody.message);
	}
	else {
		console.log("unknown event detected");
	}
}

module.exports = {
	handleTgEvent,
}