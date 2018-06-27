const Geo = require('geo-nearby');
const cacheService = require('../cache/cacheService');

function filterLocation(content, long, lati){
    console.log(`Filtering by long: ${long}, lat: ${lat}`);
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lon'});
    const geo = new Geo(dataSet, {sorted: true});
    return geo.nearBy(lati, long, 2000);
}

module.exports = {
    filterLocation,
}