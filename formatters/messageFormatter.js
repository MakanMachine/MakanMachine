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

module.exports = {
    formatRestaurantMessage,
}