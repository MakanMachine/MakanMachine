// Takes in array of restaurants, and craft a single long string of messages.
function formatRestaurantMessage(array) {
    var newStr = "";
    for(var x of array) {
        var message = `There you go!
Restaurant name: ${x.name}
Address: ${x.address}
Opening hours: ${x.opening_hours}
Nearest MRT: ${x.nearest_mrt}
Google Maps: ${x.map_url}\n`;
        newStr += message;
    }
    console.log(newStr);
    return newStr;
}

module.exports = {
    formatRestaurantMessage,
}