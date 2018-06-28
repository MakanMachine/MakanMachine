const is = require('is_js');

// Takes in array of restaurants, and craft a single long string of messages.
function formatRestaurantMessage(array) {
    var newArr = [];
    for(var x of array) {
        var message = `Restaurant name: ${x.name}
Address: ${x.address}
Opening hours: ${x.opening_hours}
Nearest MRT: ${x.nearest_mrt}
Google Maps: ${x.map_url}
\n`;
        newArr.push(message);
    }
    console.log(newArr);

    if (is.empty(newArr)) {
        newArr.push("Oops! We couldn't find any restaurants that match your criteria.");
    }
    
    return newArr;
}

function getInlineKeyboardForListView(listType, restaurantList, currentPage, lastPage) {
	const inlineKeyboardButtonList = [[]];
	const lastPageNo = parseInt(lastPage, 10);
	const pageNo = parseInt(currentPage, 10);
	if(pageNo > 1) {
		inlineKeyboardButtonList[0].push({text: 'First page', callback_data: `${listType}/page/1`});
	}
	if(pageNo > 2) {
		inlineKeyboardButtonList[0].push({text: 'Previous page', callback_data: `${listType}/page/${pageNo - 1}`});
	}
	if(pageNo < lastPageNo - 1) {
		inlineKeyboardButtonList[0].push({text: 'Next page', callback_data: `${listType}/page/${pageNo + 1}`});
	}
	if(pageNo < lastPageNo) {
		inlineKeyboardButtonList[0].push({text: 'Last page', callback_data: `${listType}/page/${lastPageNo}`});
	}

	return inlineKeyboardButtonList;
}

function getMessageForRestaurantList(restaurants) {
	let message = '';
	for(let i = 0; i < restaurants.length; i++) {
		message += `*${restaurants[i].name}*
					Address: ${restaurants[i].address}
					Opening Hours: ${restaurants[i].opening_hours}
					Nearest MRT: ${restaurants[i].nearest_mrt}
					Google Maps: ${restaurants[i].map_url}`;
	}
	return message;
}

function getMessageForListView(restaurants, totalRestaurants, pageNo, lastPageNo) {
	let message = '';
	if (totalRestaurants) > 0 {
		message = 
		`There are a total of ${totalRestaurants} restaurants!\n\n`;
		message += getMessageForRestaurantList(restaurants);
	}
	else {
		message = "Oh no, there are no restaurants I can recommend! Maybe you want to try another cuisine?";
	}
	return message;
}

module.exports = {
    formatRestaurantMessage,
    getMessageForListView,
    getInlineKeyboardForListView,
}