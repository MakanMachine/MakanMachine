/* Utility Module for Recommend command
* Module Exported:
* 1. getMessage(type, data): For formatting recommend messages. 
* 	 'data' is in JSON format
* 2. getInlineKeyboard(type, data): For inline keyboard for
* 	 recommend. 'data' is in JSON format
*/

function getMessage(type, data) {
	switch (type) {
		case 'recommend':
			return `Which cuisine would you like to have?`;
	}
}

function getInlineKeyboard(type, data) {
	switch (type) {
		case 'recommend':
			return getRecommendInlineKeyboard();
	}
}

function getRecommendInlineKeyboard() {
	return [[
		{
			text: 'Chinese',
			callback_data: 'recommend/chinese',
		},
		{
			text: 'Malay',
			callback_data: 'recommend/malay',
		}
		]]
}

module.exports = {
	getMessage,
	getInlineKeyboard,
}