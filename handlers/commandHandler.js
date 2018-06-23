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
	const message = "Makan Machine recommends you restaurants to dine at based on your criteria! Type /recommend to begin."
	await tgCaller.sendMessage(chatID, message).catch((error) => {
		console.log(error);
	});
}

async function handleRecommend(chatID) {
	const message = await recommendUtil.getMessage('recommend');
	const inlineKeyboardButtonList = await recommendUtil.getInlineKeyboard('recommend');
	tgCaller.sendMessageWithInlineKeyboard(chatID, message, inlineKeyboardButtonList);
}

async function handleUnknown(chatID) {
	const message = "Ah? Sorry I don't understand. Type /help to see the commands available or type /recommend to get a restaurant recommendation!";
	await tgCaller.sendMessage(chatID, message, { parse_mode: 'markdown'}).catch((error) => {
			console.log(error);
		});
}

// Edit this function to tell user to type in 3 cuisines separated with commas (Eg. American, Chinese, Japanese). Then use that
// msgObj and call updateUser from userpref.
async function handleSettings(chatID, msgObj) {
	const message = "Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese";
	await tgCaller.sendMessageWithForcedReply(chatID, message).catch((error) => {
			console.log(error);
		});
}

async function handleSurprise(chatID) {
	const message = 'There you go!';
	
	var result = userpref.getUser(chatID)
	.then(function(response) {
		console.log(`Response: ${response.cuisine}`);
		return response.cuisine;
	})
	.catch(function(error) {
		console.log(error);
	})
	console.log(`Result: ${result}.`);
	//var query = userpref.getUser(chatID);
	// query.exec((err, user) => {
	// 	if(err) {
	// 		console.log(err);
	// 	} else {
	// 		console.log(`User: ${user.cuisine}`);
	// 		var result = cacheService.surprise(user.cuisine);
	// 	}
	// });
	await tgCaller.sendMessage(chatID, message).catch((error) => {
		console.log(error);
	});
}

module.exports = {
	handleCommand,
}
