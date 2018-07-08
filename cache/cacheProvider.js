var axios = require('axios');
var util = require('util');
var NodeCache = require('node-cache');
var is = require('is_js');
const Geo = require('geo-nearby');

const CACHE_TABLE = {
    GENERAL: 'general',
    CUISINE: 'cuisine',
    LOCATION: 'location',
    SESSION: 'session',
    ID: 'id',
};

var cache = {};

function start() {
    if (is.empty(cache)) {
        cache.cuisine = new NodeCache();
        cache.general = new NodeCache();
        cache.location = new NodeCache();
        cache.session = new NodeCache();
        cache.id = new NodeCache();
    }

    axios({
        method:'get',
        url:'https://enigmatic-forest-44322.herokuapp.com/api/restaurants',
        auth: {
            username: 'x-api-key',
            password: 'bd345546-672d-4f09-b25a-97e7eebc6ac2'
        },
        responseType: 'json'
    })
        .then(function(response) {
            const content = response.data;
            updateGeneral(content);
            updateCuisine(content);
            updateLocation(content);
            updateId(content);
            //console.log(cache.cuisine.keys())
            //console.log(cache.cuisine.get('Japanese'));
        })
        .catch(function(error) {
            console.log(error);
        });
}

function updateGeneral(content) {
    cache.general.set(CACHE_TABLE.GENERAL, content, (err) => {
    if(err)
        console.log('Failed to store general in cache.');
    });
    console.log("All restaurants data written (cacheProvider)");
    // mykeys = cache.general.keys(); 
    // console.log(mykeys);
    // cache.general.get(CACHE_TABLE.GENERAL, (err, value) => {
    //     if(err) {
    //         console.log('Failed to retrieve from cache.');
    //     } else {
    //         if(value) {
    //             console.log(value);
    //         }
    //     }
    // });
}

function updateCuisine(content) {
    for(var x of content) {
        for(var y of x.cuisine) {
            value = cache.cuisine.get(y.toLowerCase());
            if(value == undefined) {
                cache.cuisine.set(y.toLowerCase(), new Array(x), (err) => {
                    if(err)
                        console.log(`Failed to store ${y}`);
                });
                //console.log('new cuisine key');
            } else {
                value.push(x);
                cache.cuisine.set(y.toLowerCase(), value, (err) => {
                    if(err)
                        console.log(`Failed to store ${y}`);
                });
                //console.log('new restaurant added');
            }
        }
    }
    console.log('All cuisine data written (cacheProvider)');
}

function updateId(content) {
    for(var x of content) {
        cache.id.set(x["_id"], x, (err) => {
            if(err)
                console.log(`Failed to store ${y}`);
        });
        //console.log(`new cuisine key ${x["_id"]`);
    }
    console.log('All restaurant_id data written (cacheProvider)');
}

function updateLocation(content) {
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lng'});
    const geo = new Geo(dataSet, {sorted: true});
    cache.location.set(CACHE_TABLE.LOCATION, geo, (err) => {
    if(err)
        console.log('Failed to store location in cache.');
    });
    console.log('All location data written (cacheProvider)');
}

function getInstance() {
    return cache;
}

module.exports = {
    getInstance,
    start,
}
