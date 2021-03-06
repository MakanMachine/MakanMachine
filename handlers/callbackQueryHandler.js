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
		const pageNo = callbackQueryData[0];
		const preference =  callbackQueryData[1];
		var location = false;
		if (callbackQueryData.length > 2) {
			long = callbackQueryData[2];
			lati = callbackQueryData[3];
			location = true;
		}
		console.log("page no:" + pageNo + ", preference:" + preference);
		if (pageNo) {
			if (location) {
				const payload = {page_no: pageNo, user_pref: preference, user_long: long, user_lati: lati};
				console.log(rHandler.types['ALL_PAGES_LOCATION']);
				rHandler.handleRestaurants('all_pages_location', chatData, payload);
			} else {
				const payload = {page_no: pageNo, user_pref: preference};
				console.log(rHandler.types['ALL_PAGES_NO_LOCATION']);
				rHandler.handleRestaurants('all_pages_no_location', chatData, payload);
			}
		}
		else {
			console.log('Error: Page No Invalid');
		}
	}
	await tgCaller.sendAnswerCallbackQuery(chatData.callback_query_id).catch((error) => {
		console.log(error);
	});
}

function handleCallbackQueryEvent(callbackQueryObj) {
	console.log("Handling Telegram Callback Query Event");
	const chatData = {
		callback_query_id: callbackQueryObj.id,
		chat_id: callbackQueryObj.message.chat.id,
		msg_id: callbackQueryObj.message.message_id,
		first_name: callbackQueryObj.message.first_name,
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
	types,
};