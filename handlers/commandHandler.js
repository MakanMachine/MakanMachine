/* Module to handle commands from Telegram
* 	Module exported:
*	1. handleCommand(chatID, msgObj, command): Perform correct tasks for respective commands
*/

const tgCaller = require('../api_caller/telegram_caller');
const recommendUtil = require('../utils/recommendUtils');
const cService = require('../cache/cacheService');
const sService = require('../services/surpriseService');
const userpref = require('../userpref');

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
			handleSettings(chatID);
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
	const message = `Hello ${firstName}! Hungry but don't know where to eat? Type /recommend or /settings to begin!`;
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
async function handleSettings(chatID) {
	const message = await recommendUtil.getMessage('settings');
	const availCuisines = "The available cuisines are: American, Mexican, Western, Indian, Desserts, Beer, European, Italian, Asian, Korean, Chinese, Vegetarian, Japanese, German, Indonesian, Malay, French, International, English, Indochinese, Thai, Turkish, Argentinean, Vietnamese";
	await tgCaller.sendMessage(chatID, availCuisines);
	await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
			console.log(error);
		});
}

async function handleSurprise(chatID) {
	const message = await sService.surprise({chatID: chatID});
	await tgCaller.sendMessage(chatID, message, {parse_mode: 'markdown'}).catch((error) => {
		console.log(error);
	});
}

async function handleSurpriseNearby(chatID) {
	await cService.set(cService.cacheTables.SESSION, chatID, {type: `surprise`});
	var message = `Please click the button below to send me your location!`;
	await tgCaller.sendMessageWithReplyKeyboard(chatID, message, recommendUtil.getKeyboard(recommendUtil.keyboardTypes.LOCATION)).catch(error => {
		console.log(error);
	});
}

module.exports = {
	handleCommand,
}
