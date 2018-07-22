const tgCaller = require('../api_caller/telegram_caller');
const cService = require('../cache/cacheService');
const lService = require('../services/locationService');
const msgFormatter = require('../formatters/messageFormatter');
const is = require('is_js');

const MAX_RESTAURANT_PER_PAGE = 3;

const types = {
	All_PAGES_LOCATION: 'all_pages_location',
	ALL_PAGES_NO_LOCATION: 'all_pages_no_location',
	START: 'start'
}

async function handleAllPagesWithoutLocation(chatID, msgID, payload) {
	try {
		const pageNo = payload.page_no;
		const startIndex = (parseInt(pageNo, 10) - 1) * MAX_RESTAURANT_PER_PAGE;
		const restaurants = await cService.get(cService.cacheTables.CUISINE, payload.user_pref);
		
		const selectedRestaurantList = restaurants.slice(startIndex, startIndex + MAX_RESTAURANT_PER_PAGE);
		if(selectedRestaurantList.length > 0) {
			const lastPageNo = 
				restaurants.length % MAX_RESTAURANT_PER_PAGE > 0
					? Math.floor(restaurants.length / MAX_RESTAURANT_PER_PAGE) + 1
					: restaurants.length / MAX_RESTAURANT_PER_PAGE;
			const message = msgFormatter.getMessageForListView(selectedRestaurantList, restaurants.length, pageNo, lastPageNo);
			const inlineKeyboard = msgFormatter.getInlineKeyboardForListView('restaurants', selectedRestaurantList, pageNo, lastPageNo, payload.user_pref);
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

async function handleAllPagesWithLocation(chatID, msgID, payload) {
	try {
		const pageNo = payload.page_no;
		const startIndex = (parseInt(pageNo, 10) - 1) * MAX_RESTAURANT_PER_PAGE;
		const restaurants = await cService.get(cService.cacheTables.CUISINE, payload.user_pref);
		
		var nearby = await lService.filterLocation(restaurants, payload.user_long, payload.user_lati);
        var arrTemp = [];
        for(var x of nearby) {
            value = await cService.get(cService.cacheTables.ID, x["i"]);
            arrTemp.push(value);
        }
        const filteredRestaurants = arrTemp;
		
		const selectedRestaurantList = filteredRestaurants.slice(startIndex, startIndex + MAX_RESTAURANT_PER_PAGE);
		if(selectedRestaurantList.length > 0) {
			const lastPageNo = 
				restaurants.length % MAX_RESTAURANT_PER_PAGE > 0
					? Math.floor(filteredRestaurants.length / MAX_RESTAURANT_PER_PAGE) + 1
					: filteredRestaurants.length / MAX_RESTAURANT_PER_PAGE;
			const message = msgFormatter.getMessageForListView(selectedRestaurantList, filteredRestaurants.length, pageNo, lastPageNo);
			const inlineKeyboard = msgFormatter.getInlineKeyboardForListView('restaurants', selectedRestaurantList, pageNo, lastPageNo, payload.user_pref, payload.user_long, payload.user_lati);
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
	if(is.propertyDefined(payload, 'user_long')) {
		handleAllPagesWithLocation(chatID, null, {page_no: 1, user_pref: payload.user_pref, user_long: payload.user_long, user_lati: payload.user_lati});
	} else {
		handleAllPagesWithoutLocation(chatID, null, {page_no: 1, user_pref: payload.user_pref});
	}
}

async function handleRestaurants(type, chatData, payload) {
	console.log(`Handling Restaurant Request: ${type}`);
	switch(type) {
		case types.All_PAGES_LOCATION:
			await handleAllPagesWithLocation(chatData.chat_id, chatData.msg_id, payload);
			break;
		case types.ALL_PAGES_NO_LOCATION:
			await handleAllPagesWithoutLocation(chatData.chat_id, chatData.msg_id, payload);
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