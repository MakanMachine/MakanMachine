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

function getInlineKeyboardForListView(listType, restaurantList, currentPage, lastPage, preference) {
	const inlineKeyboardButtonList = [[]];
	const lastPageNo = parseInt(lastPage, 10);
	const pageNo = parseInt(currentPage, 10);
	if(pageNo > 1) {
		inlineKeyboardButtonList[0].push({text: 'First page', callback_data: `${listType}/1/${preference}`});
	}
	if(pageNo > 2) {
		inlineKeyboardButtonList[0].push({text: 'Previous page', callback_data: `${listType}/${pageNo - 1}/${preference}`});
	}
	if(pageNo < lastPageNo - 1) {
		inlineKeyboardButtonList[0].push({text: 'Next page', callback_data: `${listType}/${pageNo + 1}/${preference}`});
	}
	if(pageNo < lastPageNo) {
		inlineKeyboardButtonList[0].push({text: 'Last page', callback_data: `${listType}/${lastPageNo}/${preference}`});
	}

	return inlineKeyboardButtonList;
}

function getMessageForRestaurantList(restaurants) {
	let message = '';
	for(let i = 0; i < restaurants.length; i++) {
		message += `*${restaurants[i].name}*\nAddress: ${restaurants[i].address}\nOpening Hours: ${restaurants[i].opening_hours}\nNearest MRT: ${restaurants[i].nearest_mrt}\nGoogle Maps: ${restaurants[i].map_url}\n\n`;
	}
	return message;
}

function getMessageForListView(restaurants, totalRestaurants, pageNo, lastPageNo) {
	let message = '';
	if (totalRestaurants > 0) {
		message = 
		`There are a total of ${totalRestaurants} restaurants!\n\n`;
		message += getMessageForRestaurantList(restaurants);
	}
	else {
		message = "Oh no, there are no restaurants I can recommend! Maybe you want to try another cuisine?";
	}
	return message;
}

function getMessageForEmptyPage() {
	return ("Oh no! So sorry but I could not find any restaurants to recommend! Why not try another cuisine?");
}

module.exports = {
    formatRestaurantMessage,
    getMessageForListView,
    getInlineKeyboardForListView,
    getMessageForEmptyPage,
}