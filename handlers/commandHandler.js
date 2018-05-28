/* Module to handle commands from Telegram
* 	Module exported:
*	1. handleCommand(chatID, msgObj, command): Perform correct tasks for respective commands
*/

const tgCaller = require('../api_caller/telegram_caller');

function handleCommand(chatID, msgObj, command) {
	console.log("Handling command: " + command);
	const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : ' ';

	switch (command) {
		case 'start':
			handleStart(chatID, firstName);
			break;
		case 'help':
			handleHelp(chatID);
			break;
		case 'recommend':
			handleRecommend(chatID);
			break;
		default:
			handleUnknown(chatID);
			break;
	}
}

function handleStart(chatID, firstName) {
	const message = `Hello ${firstName}! Hungry but don't know where to eat? Type /recommend to begin!`;
	tgCaller.sendMessge(chatID, message).then((result) => {
		console.log(result.message);
	}).catch((error) => {
		console.log(error);
	});
}

function handleHelp(chatID) {
	const message = "Makan Machine recommends you restaurants to dine at based on your criteria! Type /recommend to begin."
	tgCaller.sendMessge(chatID, message).then((result) => {
		console.log(result.message);
	}).catch((error) => {
		console.log(error);
	});
}

function handleRecommend(chatID) {
	const message = "Please select your preferences so that we can recommend something you are craving for!"
	tgCaller.sendMessge(chatID, message).then((result) => {
			console.log(result.message);
		}).catch((error) => {
			console.log(error);
		});
}

function handleUnknown(chatID) {
	const message = "Ah? Sorry I don't understand. Type /help to see the commands available or type /recommend to get a restaurant recommendation!";
	tgCaller.sendMessge(chatID, message).then((result) => {
			console.log(result.message);
		}).catch((error) => {
			console.log(error);
		});
}

module.exports = {
	handleCommand,
}
