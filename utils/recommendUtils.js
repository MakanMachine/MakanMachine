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
			return `Please specify your preferences so that we can find the most suitable restaurant for you! You need to specify at least 1 option.`;
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
			text: 'Cuisine',
			callback_data: 'recommend/cuisine',
		},
		{
			text: 'Location',
			callback_data: 'recommend/location',
		}
		]]
}

module.exports = {
	getMessage,
	getInlineKeyboard,
}