/* Modules to handle message replies from Users
* 	Module Exported:
*	1. handleReply(chatID, msgObj): Handles Message Replies from Users
*/

const tgCaller = require('../api_caller/telegram_caller');
const userPref = require('../userpref');

const types = {
	PREFERENCE: 'preference',
	RECOMMEND: 'recommend',
	LOCATION: 'location'
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
		case (types.RECOMMEND):
			handleRecommendReply(chatID, firstName, msgObj);
			break;
		case (types.LOCATION):
			handleLocationReply(chatID, firstName, msgObj);
			break;
		default:
			break;
	}
}

async function handlePreferenceReply(chatID, firstName, msgObj) {
	const preference = msgObj.text;
	console.log("Preference updated: " + preference);
	const message = `Your preference has been updated! Type /surprise\\_me to get a random restaurent!`
	await Promise.all([
		tgCaller.sendMessage(chatID, message, {parse_mode: 'markdown'}),
		userPref.updateUser(chatID, msgObj)]).catch((error => {
			console.log(error);
		}))
}

async function handleRecommendReply(chatID, firstName, msgObj) {
	const preference = msgObj.text;
	console.log("Preference updated:" + preference);
	const message = `Your preference has been updated! Do you want to specify your location? Please reply with Y or N.`;
	await Promise.all([
		tgCaller.sendMessageWithForcedReply(chatID, message)]).catch((error => {
			console.log(error);
		}))
}

async function handleLocationReply(chatID, firstName, msgObj) {
	const useLocation = msgObj.text;
	console.log("Use location:" + useLocation);
	const message = `Ok, getting you the list of restaurants now! Please hold on!`;
	await Promise.all([
		tgCaller.sendMessage(chatID, message, {parse_mode: 'markdown'})]).catch((error => {
			console.log(error);
		}))
}

function getReplyType(previousMsg) {
	switch(previousMsg) {
		case 'Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese':
			return types.PREFERENCE;
		case 'What cuisine are you craving?':
			return types.RECOMMEND;
		case 'Your preference has been updated! Do you want to specify your location? Please reply with Y or N.':
			return types.LOCATION;
		default:
			console.log("Reply to message not supported");
			return null;
	}
}

module.exports = {
	handleReply,
}