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
	CUISINE: 'cuisine',
};

function getMessage(type, data) {
	switch (type) {
		case 'recommend':
			return "Do you want to search for restaurants by cuisine or MRT location?";
		case 'cuisine':
			return "Reply this message with the cuisine that you feel like having! E.g. Korean";
		case 'mrt':
			return "Reply this message with the MRT station of your choice! E.g. Dhoby Ghaut";
		case 'settings':
			return "Please type in a maximum of 3 cuisines that you prefer, with a comma separating each cuisine! Eg. American, Chinese, Japanese";
		case 'help':
			return "Makan Machine recommends you restaurants to dine at based on your preferred cuisines!\nType /recommend or tell the bot the cuisine you are craving for recommendations now!\n\nFor those who are unsure of cuisine you want, head on over to /settings to key in your all time favourite cuisines and let /surprise_me choose a random restuarant for you!";
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
		case 'cuisine':
			return getCuisineMRTInlineKeyboard();
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

function getCuisineMRTInlineKeyboard() {
	return [
		[{
			text: 'Cuisine',
		}],

		[{
			text: 'MRT',
		}],
	]
}

module.exports = {
	getMessage,
	getKeyboard,
	keyboardTypes: KEYBOARD_TYPES,
}