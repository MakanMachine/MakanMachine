const tgCaller = require('../api_caller/telegram_caller');
const rHandler = require('./restaurantHandler');

const types = {
	RESTAURANTS: 'restaurants'
};

async function handleRestaurantCallbackQuery(chatData, callbackQueryData) {
	if(callbackQueryData[0] == 'start') {
		rHandler.handleRestaurants(rHandler.types.ALL_PAGES, chatData);
	}

	else {
		const pageNo = callbackQueryData[1];
		if(pageNo) {
			const payload = {page_no: pageNo};
			
		}
	}
}

function handleCallbackQueryEvent(callbackQueryObj) {
	console.log("Handling Telegram Callback Query Event");
	const chatData = {
		callback_query_id: callbackQueryObj.id,
		chat_id: callbackQueryObj.message.chat.id,
		msg_id: callbackQueryObj.message.message_id,
		first_name: callbackQueryObj.message.
	};
	const callbackQueryData = callbackQueryObj.data.split('/');
	const callbackQueryType = callbackQueryData.shift();
	console.log(`Callback query type detected: ${callbackQueryType}`);
	switch(callbackQueryType) {
		case types.RESTAURANTS:
			handleRestaurantCallbackQuery(chatData, callbackQueryData);
			break;
		default:
			console.log("Unknown Callback Query Type");
			break;
	}
}

module.exports = {
	handleCallbackQueryEvent,
};