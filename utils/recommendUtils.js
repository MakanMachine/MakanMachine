/* Utility Module for Recommend command
* Module Exported:
* 1. getMessage(type, data): For formatting recommend messages. 
* 	 'data' is in JSON format
* 2. getInlineKeyboard(type, data): For inline keyboard for
* 	 recommend. 'data' is in JSON format
*/
const KEYBOARD_TYPES = {
	RECOMMEND: 'recommend',
	LOCATION: 'location',
};

function getMessage(type, data) {
	switch (type) {
		case 'recommend':
			return `Reply this message with the cuisine that you feel like having! E.g Korean`;
		case 'settings':
			return "Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese";
		case 'help':
			return "Makan Machine recommends you restaurants to dine at based on your criteria! Type /recommend to begin.";
		case 'unknown':
			return "Ah? Sorry I don't understand. Type /help to see the commands available or type /recommend to get a restaurant recommendation!";
		}
}

function getKeyboard(type) {
	switch (type) {
		case 'recommend':
			return getRecommendInlineKeyboard();
			break;
		case 'location':
			return getRequestLocationReplyKeyboard();
			break;
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

function getRequestLocationReplyKeyboard() {
	return [
		[{
			text: `Yes, send my location`,
			request_location: true,
		}],

		[{
			text: `No, thanks`,
		}],
	]
}

module.exports = {
	getMessage,
	getKeyboard,
	keyboardTypes: KEYBOARD_TYPES,
}