var axios = require('axios');
var util = require('util');
var NodeCache = require('node-cache');
var is = require('is_js');

const CACHE_TABLE = {
    GENERAL: 'general',
    CUISINE: 'cuisine',
};

var cache = {};

function start() {
    if (is.empty(cache)) {
        cache.cuisine = new NodeCache();
        cache.general = new NodeCache();
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
        })
        .catch(function(error) {
            console.log(error);
        });
}

function updateGeneral(content) {
    cache.general.set(CACHE_TABLE.GENERAL, content, (err) => {
    if(err)
        console.log('Failed to store in cache.');
    });
    console.log("All restaurants data written");
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
    for(var i=0; i < content.length; i++) {
        var obj = content[i];
        for(var j=0; j < obj.cuisine.length; j++) {
            value = cache.cuisine.get(obj.cuisine[j]);
            if(value == undefined) {
                cache.cuisine.set(obj.cuisine[j], new Array(obj));
                //console.log('new cuisine key');
            } else {
                value.push(obj);
                cache.cuisine.set(obj.cuisine[j], value);
                //console.log('new restaurant added');
            }
        }
    }
}

function getInstance() {
    return cache;
}

module.exports = {
    getInstance,
    start,
}
//This version doesn't work.
// function updateCuisine(content) {
//     var x;
//     var y;
//     for(x in content) {
//         for(y in x.cuisine) {
//             value = cache.cuisine.get(y);
//             if(value == undefined) {
//                 cache.cuisine.set(y, new Array(x));
//                 //console.log('new cuisine key');
//             } else {
//                 value.push(x);
//                 cache.cuisine.set(y, value);
//                 //console.log('new restaurant added');
//             }
//         }
//     }
// }