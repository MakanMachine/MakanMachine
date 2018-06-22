const NodeCache = require('node-cache');
const cacheProvider = require('./cacheProvider');

// Takes in an options object containing cuisine and location.
function get(options) {
    console.log(`Getting cache value for cuisine: ${options.cuisine}.`)
    return new Promise((resolve, reject) => {
        cacheProvider.getInstance()[cuisine].get(options.cuisine, (err, result) => {
            if(err) {
                reject(new Error(`Unable to get cache value for cuisine: ${options.cuisine} => Err: ${err}`));
            } else {
                console.log(`Got cache value for cuisine: ${options.cuisine}.`);
                resolve(result);
            }
        });
    });
}

// Takes in array of restaurants, and filter out info to return to user
function refineMessage(array) {
    var newArr = [];
    for(var x of array) {
        newArr.push({name: x.name, opening_hours: x.opening_hours, address: x.address, nearest_mrt: x.nearest_mrt, map_url: x.map_url});
    }
    console.log(newArr);
    return newArr;
}

module.exports = {
    get,
    refineMessage,
}