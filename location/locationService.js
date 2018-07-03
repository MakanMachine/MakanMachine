const Geo = require('geo-nearby');
const cacheService = require('../cache/cacheService');

async function filterLocation(content, long, lati){
    console.log(`Filtering by long: ${long}, lati: ${lati}.`);
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lng'});
    console.log(`dataSet: ${dataSet}`);
    const geo = new Geo(dataSet, {sorted: true});
    const nearby = geo.nearBy(lati, long, 1500);
    var arr = [];
    for(var x of nearby) {
        value = await cacheService.get(cacheService.cacheTables.ID, x["i"]);
        arr.push(value);
        console.log(value);
    }
    console.log(`Filtered location array: ${arr}`);
    return arr;
}

module.exports = {
    filterLocation,
}