const tgCaller = require('../api_caller/telegram_caller');
const cService = require('../cache/cacheService');
const msgFormatter = require('../formatters/messageFormatter');

const MAX_RESTAURANT_PER_PAGE = 3;

const types = {
	All_PAGES: 'all_pages',
	START: 'start'
}

async function handleAllPages(chatID, msgID, payload) {
	try {
		const pageNo = payload.page_no;
		const startIndex = (parseInt(pageNo, 10) - 1) * MAX_RESTAURANT_PER_PAGE;
		const restaurants = await cService.get(cService.cacheTables.CUISINE, payload.userPref);
		//if(restaurants.constructor === Array) {
			//console.log("restaurants is an array");
		//}
		//else {
			//console.log("restaurants is not an array");
		//}
		const selectedRestaurantList = restaurants.slice(startIndex, startIndex + MAX_RESTAURANT_PER_PAGE);
		if(selectedRestaurantList.length > 0) {
			const lastPageNo = 
				restaurants.length % MAX_RESTAURANT_PER_PAGE > 0
					? Math.floor(restaurants.length / MAX_RESTAURANT_PER_PAGE) + 1
					: restaurants.length / MAX_RESTAURANT_PER_PAGE;
			const message = msgFormatter.getMessageForListView(selectedRestaurantList, restaurants.length, pageNo, lastPageNo);
			const inlineKeyboard = msgFormatter.getInlineKeyboardForListView('restaurants', selectedRestaurantList, pageNo, lastPageNo, payload.userPref);
			if (msgID) {
				await tgCaller.editMessageWithInlineKeyboard(chatID, msgID, message, inlineKeyboard);
			}
			else {
				await tgCaller.sendMessageWithInlineKeyboard(chatID, message, inlineKeyboard);
			}
		}
		else {
			console.log('Empty Restaurant List Page.');
			const message = msgFormatter.getMessageForEmptyPage();
			await tgCaller.sendMessage(chatID, message);
		} 
	}	
	catch (error) {
			console.log(error);
	}
}

function handleStart(chatID, payload) {
	handleAllPages(chatID, {page_no: 1, userPref: payload.userPref});
}

async function handleRestaurants(type, chatData, payload) {
	console.log(`Handling Restaurant Request: ${type}`);
	switch(type) {
		case types.All_PAGES:
			await handleAllPages(chatData.chat_id, chatData.msg_id, payload);
			break;
		case types.START:
			await handleStart(chatData.chat_id, payload);
			break;
		default:
			break;
	}
}

module.exports = {
	handleRestaurants,
	types,
};