/* Modules to handle message replies from Users
* 	Module Exported:
*	1. handleReply(chatID, msgObj): Handles Message Replies from Users
*/

const tgCaller = require('../api_caller/telegram_caller');
const userPref = require('../userpref');
const cService = require('../cache/cacheService');
const lService = require('../services/locationService');
const msgFormatter = require('../formatters/messageFormatter');
const recommendUtils = require('../utils/recommendUtils');
const rHandler = require('../handlers/restaurantHandler');
const is = require('is_js');

const types = {
	PREFERENCE: 'preference',
	RECOMMEND: 'recommend',
	LOCATION: 'location',
}

function handleReply(chatID, msgObj) {
	const firstName = msgObj.chat.first_name || '';
	if(msgObj.location) {
		handleLocationReply(chatID, firstName, msgObj);
	} else {
		const replyID = msgObj.reply_to_message.message_id;
		const previousMsg = msgObj.reply_to_message.text;
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
			default:
				break;
		}
	}
}

function handleReplyIntent(chatID, firstName, dfObj) {
	const type = dfObj.type;
	switch (type) {
		case (types.RECOMMEND):
			handleRecommendReply(chatID, firstName, dfObj);
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
		}));
}

async function handleRecommendReply(chatID, firstName, msgObj) {
	const preference = msgObj.text.split(' ')[0];
	const useLocation = msgObj.text.split(' ')[1].toLowerCase();
	if(useLocation == 'y') {
		await cService.set(cService.cacheTables.SESSION, chatID, {type: 'recommend', cuisine: preference});
		var message = `Please click the button below to send me your location!`;
		await tgCaller.sendMessageWithReplyKeyboard(chatID, message, recommendUtils.getKeyboard(recommendUtils.keyboardTypes.LOCATION, preference)).catch(error => {
			console.log(error);
		});
	} else {
		console.log("Preference updated:" + preference);
		//const message = `Got it! Please wait while I get the list of restaurants!`;
		const arr = await cService.get(cService.cacheTables.CUISINE, preference);
		try {
			const chatData = {chat_id: chatID};
			await rHandler.handleRestaurants(rHandler.types.START, chatData, {user_pref: preference});
		} catch (error) {
			console.log(error);
		}
	}
}

function getReplyType(previousMsg) {
	switch(previousMsg) {
		case 'Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese':
			return types.PREFERENCE;
		case 'Please specify a cuisine that you prefer, followed by a Y or N to indicate if you want to search by your current location!\nE.g Korean Y':
			return types.RECOMMEND;
		default:
			console.log("Reply to message not supported");
			return null;
	}
}

module.exports = {
	handleReply,
}