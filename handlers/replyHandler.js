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
	CUISINE: 'cuisine',
	LOCATION: 'location',
	MRT: 'mrt',
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
			case (types.CUISINE):
				handleCuisineReply(chatID, firstName, msgObj);
				break;
			case (types.MRT):
				handleMrtReply(chatID, firstName, msgObj);
			default:
				break;
		}
	}
}

function handleReplyIntent(chatID, firstName, dfObj) {
	const type = dfObj.type;
	switch (type) {
		case (types.CUISINE):
			handleCuisineReply(chatID, firstName, dfObj);
			break;
		case (types.MRT):
			handleMrtReply(chatID, firstName, dfObj);
			break;
		default:
			break;
	}
}

async function handlePreferenceReply(chatID, firstName, msgObj) {
	const preference = msgObj.text;
	console.log("Preference updated: " + preference);
	const message = `Your preference has been updated! Type /surprise\\_me to get a random restaurant!`
	await Promise.all([
		tgCaller.sendMessage(chatID, message, {parse_mode: 'markdown'}),
		userPref.updateUser(chatID, msgObj)]).catch((error => {
			console.log(error);
		}));
}

async function handleCuisineReply(chatID, firstName, msgObj) {
	const preference = msgObj.text.split(' ')[0];
	console.log("Preference updated: " + preference);
	await cService.set(cService.cacheTables.SESSION, chatID, {type: 'cuisine', preference: preference});
	var message = `Send me your location if you would like me to search using your current location.\n\nAlternatively, you can also choose to send me any location by clicking the \u{1F4CE} icon below.`;
	await tgCaller.sendMessageWithReplyKeyboard(chatID, message, recommendUtils.getKeyboard(recommendUtils.keyboardTypes.LOCATION, preference)).catch(error => {
		console.log(error);
	});
}

async function handleNoLocationReply(chatID, msgObj) {
	var session = await cService.get(cService.cacheTables.SESSION, chatID);
    const preference = session.preference;
    const message = `Got it! Please wait while I get the list of restaurants!`;
    await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, message).catch((error) => {
        console.log(error);
    });
    try {
        const chatData = {chat_id: chatID};
        await rHandler.handleRestaurants(rHandler.types.START, chatData, {user_pref: preference});
    } catch (error) {
        console.log(error);
    }
}

function getReplyType(previousMsg) {
	switch(previousMsg) {
		case 'If you wish to edit your preferences, please reply to this message in the following format, up to a maximum of 3 cuisines. E.g. American, Chinese, Japanese':
			return types.PREFERENCE;
		case 'Reply this message with the cuisine that you feel like having! E.g. Korean':
			return types.CUISINE;
		case 'Reply this message with the MRT station of your choice! E.g. Dhoby Ghaut':
			return types.MRT;
		default:
			console.log("Reply to message not supported");
			return null;
	}
}

async function handleRecommendReply(chatID, type) {
	if(type == 'Cuisine') {
		const message = await recommendUtils.getMessage('cuisine');
		const availCuisines = "The available cuisines are: American, Argentinean, Asian, Beer, Chinese, Desserts, English, European, French, German, Indian, Indochinese, Indonesian, International, Italian, Japanese, Korean, Malay, Mexican, Thai, Turkish, Vegetarian, Vietnamese, Western";
		await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, availCuisines);
		await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
			console.log(error);
		});
	} else if(type == 'MRT') {
		const message = await recommendUtils.getMessage('mrt');
		const availMrts = "Choose from any MRT station in Singapore!";
		await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, availMrts);
		await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
			console.log(error);
		});
	}
}

async function handleMrtReply(chatID, firstName, msgObj) {
	const preference = msgObj.text.trim();
	console.log("Preference updated: " + preference);
	await cService.set(cService.cacheTables.SESSION, chatID, {type: 'mrt', preference: preference});
	const message = `Got it! Please wait while I get the list of restaurants!`;
	await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, message).catch((error) => {
        console.log(error);
    });
    try {
        const chatData = {chat_id: chatID};
        await rHandler.handleRestaurants(rHandler.types.START, chatData, {user_pref: preference});
    } catch (error) {
        console.log(error);
    }
	
}

module.exports = {
	handleReply,
	handleReplyIntent,
	handleNoLocationReply,
	handleRecommendReply,
}