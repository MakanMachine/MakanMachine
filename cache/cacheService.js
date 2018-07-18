const NodeCache = require('node-cache');
const cacheProvider = require('./cacheProvider');
const lService = require('../services/locationService');
const is = require('is_js');

const CACHE_TABLE = {
    GENERAL: 'general',
    CUISINE: 'cuisine',
    LOCATION: 'location',
    SESSION: 'session',
    ID: 'id',
};

async function get(table, key) {
    if (typeof key == "string") {
        var key = key.trim().toLowerCase();
    }
    return new Promise((resolve, reject) => {
        cacheProvider.getInstance()[table].get(key, (err, result) => {
            if(err) {
                reject(new Error(`Unable to get cache value for: ${key} => Err: ${err}`));
            } else {
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

module.exports = {
    cacheTables: CACHE_TABLE,
    get,
    set,
}