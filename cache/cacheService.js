const NodeCache = require('node-cache');
const cacheProvider = require('./cacheProvider');

const CACHE_TABLE = {
    GENERAL: 'general',
    CUISINE: 'cuisine',
    LOCATION: 'location',
    RECOMMEND: 'recommend',
    ID: 'id',
};

async function get(table, key) {
    if (typeof key == "string") {
        var key = key.trim().toLowerCase();
    }
    console.log(`Getting cache value for: ${key}.`)
    return new Promise((resolve, reject) => {
        cacheProvider.getInstance()[table].get(key, (err, result) => {
            if(err) {
                reject(new Error(`Unable to get cache value for: ${key} => Err: ${err}`));
            } else {
                console.log(`Got cache value for: ${key}.`);
                resolve(result);
            }
        });
    });
}

async function set(table, key, value) {
    return new Promise((resolve, reject) => {
        if (key) {
          cacheProvider.getInstance()[table].set(key, value, (err) => {
            if (err) {
              reject(new Error(`Unable to set cache for key: ${key} => Err: ${err}`));
            } else {
              resolve(`Cache updated for: ${key}`);
            }
          });
        } else {
          reject(new Error('No cache key given.'));
        }
    });
}

// Returns a random restaurant based on array of cuisines.
async function surprise(preference) {
    console.log(`Preparing surprise!`);
    console.log(`Preference: ${preference}`);
    var arrCuisine = [];
    for(var x of preference) {
        var arrTemp = await get(CACHE_TABLE.CUISINE, x);
        arrCuisine = arrCuisine.concat(arrTemp);
        console.log(`arrTemp: ${arrTemp}`);
    }
    console.log(`Array: ${arrCuisine}`);
    return arrCuisine[Math.floor(Math.random() * arrCuisine.length)];
}

module.exports = {
    cacheTables: CACHE_TABLE,
    get,
    surprise,
    set,
}