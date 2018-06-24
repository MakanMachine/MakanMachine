const NodeCache = require('node-cache');
const cacheProvider = require('./cacheProvider');

async function getByCuisine(option) {
    var key = option.trim().toLowerCase();
    console.log(`Getting cache value for cuisine: ${key}.`)
    return new Promise((resolve, reject) => {
        cacheProvider.getInstance().cuisine.get(key, (err, result) => {
            if(err) {
                reject(new Error(`Unable to get cache value for cuisine: ${key} => Err: ${err}`));
            } else {
                console.log(`Got cache value for cuisine: ${key}.`);
                resolve(result);
            }
        });
    });
}

// Returns a random restaurant based on array of cuisines.
async function surprise(preference) {
    console.log(`Preparing surprise!`);
    console.log(`Preference: ${preference}`);
    var arrCuisine = [];
    for(var x of preference) {
        var arrTemp = await getByCuisine(x);
        arrCuisine = arrCuisine.concat(arrTemp);
        console.log(`arrTemp: ${arrTemp}`);
    }
    console.log(`Array: ${arrCuisine}`);
    return arrCuisine[Math.floor(Math.random() * arrCuisine.length)];
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
    getByCuisine,
    surprise,
    refineMessage,
}