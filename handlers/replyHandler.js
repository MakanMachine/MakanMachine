/* Modules to handle message replies from Users
* 	Module Exported:
*	1. handleReply(chatID, msgObj): Handles Message Replies from Users
*/

const tgCaller = require('../api_caller/telegram_caller');
const userPref = require('../userpref');

const types = {
	PREFERENCE: 'preference'
}

function handleReply(chatID, msgObj) {
	const replyID = msgObj.reply_to_message.message_id;
	const previousMsg = msgObj.reply_to_message.text;
	const firstName = msgObj.chat.first_name || '';
	console.log("Handling reply to message: " + previousMsg);
	const replyType = getReplyType(previousMsg);
	console.log("Reply type:", replyType);
	switch(replyType) {
		case (types.PREFERENCE):
			handlePreferenceReply(chatID, firstName, msgObj);
			break;
		default:
			break;
	}
}

async function handlePreferenceReply(chatID, firstName, msgObj) {
	const preference = msgObj.text;
	console.log("Preference updated: " + preference);
	const message = `Your preference has been updated! Type /surprise_me to get a random restaurent!`
	await Promise.all([
		tgCaller.sendMessage(chatID, message, {parse_mode: 'markdown'}),
		userPref.updateUser(msgObj)]).catch((error => {
			console.log(error);
		}))
}

function getReplyType(previousMsg) {
	switch(previousMsg) {
		case 'Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese':
			return types.PREFERENCE;
		default:
			console.log("Reply to message not supported");
			return null;
	}
}

module.exports = {
	handleReply,
}