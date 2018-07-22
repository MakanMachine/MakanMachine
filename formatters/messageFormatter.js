const is = require('is_js');

// Takes in array of restaurants, and craft a single long string of messages.
function formatRestaurantMessage(array) {
    var newArr = [];
    for(var x of array) {
        var message = `*${x.name}*\nAddress: ${x.address}\nOpening hours:\n${x.opening_hours}\nNearest MRT: ${x.nearest_mrt}\nGoogle Maps: ${x.map_url}\n`;
        newArr.push(message);
    }
    console.log(newArr);

    if (is.empty(newArr)) {
        newArr.push("Oops! We couldn't find any restaurants that match your criteria.");
    }
    
    return newArr;
}

function getInlineKeyboardForListView(listType, restaurantList, currentPage, lastPage, preference, long, lati) {
	const inlineKeyboardButtonList = [[]];
	const lastPageNo = parseInt(lastPage, 10);
	const pageNo = parseInt(currentPage, 10);
	if(pageNo > 1) {
        if(long != null) {
		  inlineKeyboardButtonList[0].push({text: '<< 1', callback_data: `${listType}/1/${preference}/${long}/${lati}`});
        } else {
            inlineKeyboardButtonList[0].push({text: '<< 1', callback_data: `${listType}/1/${preference}`});
        }
	}
	if(pageNo > 2) {
        if (long != null) {
		  inlineKeyboardButtonList[0].push({text: `< ${pageNo - 1}`, callback_data: `${listType}/${pageNo - 1}/${preference}/${long}/${lati}`});
        } else {
            inlineKeyboardButtonList[0].push({text: `< ${pageNo - 1}`, callback_data: `${listType}/${pageNo - 1}/${preference}`});               
        }
	}
	if(pageNo < lastPageNo - 1) {
        if (long != null) {
		  inlineKeyboardButtonList[0].push({text: `${pageNo + 1} >`, callback_data: `${listType}/${pageNo + 1}/${preference}/${long}/${lati}`});
        } else {
            inlineKeyboardButtonList[0].push({text: `${pageNo + 1} >`, callback_data: `${listType}/${pageNo + 1}/${preference}`});
        }
	}
	if(pageNo < lastPageNo) {
        if (long != null) {
		  inlineKeyboardButtonList[0].push({text: `${lastPageNo} >>`, callback_data: `${listType}/${lastPageNo}/${preference}/${long}/${lati}`});
        } else {
            inlineKeyboardButtonList[0].push({text: `${lastPageNo} >>`, callback_data: `${listType}/${lastPageNo}/${preference}`});
        }
	}

	return inlineKeyboardButtonList;
}

function getMessageForRestaurantList(restaurants) {
	let message = '';
	for(let i = 0; i < restaurants.length; i++) {
		message += `*${restaurants[i].name}*\nAddress: ${restaurants[i].address}\nOpening Hours:\n${restaurants[i].opening_hours}\nNearest MRT: ${restaurants[i].nearest_mrt}\nGoogle Maps: ${restaurants[i].map_url}\n\n`;
	}
	return message;
}

function getMessageForListView(restaurants, totalRestaurants, pageNo, lastPageNo) {
	let message = '';
	if (totalRestaurants == 1) {
        message = 
        `There are a total of ${totalRestaurants} restaurant!\n\n`;
        message += getMessageForRestaurantList(restaurants);
    } else if (totalRestaurants > 1) {
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