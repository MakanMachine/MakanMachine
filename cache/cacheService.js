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

module.exports = {
    get,
}