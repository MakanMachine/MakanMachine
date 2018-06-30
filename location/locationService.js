const Geo = require('geo-nearby');
const cacheService = require('../cache/cacheService');

function filterLocation(content, long, lati){
    console.log(`Filtering by long: ${long}, lati: ${lati}.`);
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lng'});
    console.log(`dataSet: ${dataSet}`);
    const geo = new Geo(dataSet, {sorted: true});
    return geo.nearBy(lati, long, 100000);
}

module.exports = {
    filterLocation,
}