/* Module to handle commands from Telegram
* 	Module exported:
*	1. handleCommand(chatID, msgObj, command): Perform correct tasks for respective commands
*/

const tgCaller = require('../api_caller/telegram_caller');
const recommendUtil = require('../utils/recommendUtils');
const userpref = require('../userpref');
const cacheService = require('../cache/cacheService');

function handleCommand(chatID, msgObj, command) {
	console.log("Handling command: " + command);
	const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : ' ';

	switch (command) {
		case 'start':
			handleStart(chatID, firstName, msgObj);
			break;
		case 'help':
			handleHelp(chatID);
			break;
		case 'recommend':
			handleRecommend(chatID);
			break;
		case 'settings':
			handleSettings(chatID, msgObj);
			break;
		case 'surprise_me':
			handleSurprise(chatID);
			break;
		case 'surprise_me_nearby':
			handleSurpriseNearby(chatID);
			break;
		default:
			handleUnknown(chatID);
			break;
	}
}

async function handleStart(chatID, firstName, msgObj) {
	const message = `Hello ${firstName}! Hungry but don't know where to eat? Type /recommend to begin!`;
	userpref.startUser(chatID, msgObj);
	await tgCaller.sendMessage(chatID, message).catch((error) => {
		console.log(error);
	});
}

async function handleHelp(chatID) {
	const message = await recommendUtil.getMessage('help');
	await tgCaller.sendMessage(chatID, message).catch((error) => {
		console.log(error);
	});
}

async function handleRecommend(chatID) {
	const message = await recommendUtil.getMessage('recommend');
	const availCuisines = "The available cuisines are: American, Mexican, Western, Indian, Desserts, Beer, European, Italian, Asian, Korean, Chinese, Vegetarian, Japanese, German, Indonesian, Malay, French, International, English, Indochinese, Thai, Turkish, Argentinean, Vietnamese";
	await tgCaller.sendMessage(chatID, availCuisines);
	await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
		console.log(error);
	});
}

async function handleUnknown(chatID) {
	const message = await recommendUtil.getMessage('unknown');
	await tgCaller.sendMessage(chatID, message, { parse_mode: 'markdown'}).catch((error) => {
			console.log(error);
		});
}

// Edit this function to tell user to type in 3 cuisines separated with commas (Eg. American, Chinese, Japanese). Then use that
// msgObj and call updateUser from userpref.
async function handleSettings(chatID, msgObj) {
	const message = await recommendUtil.getMessage('settings');
	const availCuisines = "The available cuisines are: American, Mexican, Western, Indian, Desserts, Beer, European, Italian, Asian, Korean, Chinese, Vegetarian, Japanese, German, Indonesian, Malay, French, International, English, Indochinese, Thai, Turkish, Argentinean, Vietnamese";
	await tgCaller.sendMessage(chatID, availCuisines);
	await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
			console.log(error);
		});
}

async function handleSurprise(chatID) {
	var message;
	const user = await userpref.getUser(chatID);
	if(user == null) {
		message = `Oops! You have not yet configured your settings. Run /settings to begin!`;
	}
	const result = await cacheService.surprise({cuisine: user.cuisine}).catch((error) => {
		console.log(error);
	});
	if(result) {
		console.log(`User: ${user}.`);
		console.log(`Result: ${result.name}`);
		message = `There you go!
Restaurant name: ${result.name}
Address: ${result.address}
Opening hours: ${result.opening_hours}
Nearest MRT: ${result.nearest_mrt}
Google Maps: ${result.map_url}`;
	} else {
		message = `Oops! We could not find you a restaurant based on your preferences. Run /settings to edit your preferences!`;
	}
	await tgCaller.sendMessage(chatID, message).catch((error) => {
		console.log(error);
	});
}

async function handleSurpriseNearby(chatID) {
	await cacheService.set(cacheService.cacheTables.SESSION, chatID, {type: `surprise`});
	var message = `Please click the button below to send us your location!`;
	await tgCaller.sendMessageWithReplyKeyboard(chatID, message, recommendUtil.getKeyboard(recommendUtil.keyboardTypes.LOCATION)).catch(error => {
		console.log(error);
	});
}

module.exports = {
	handleCommand,
}
