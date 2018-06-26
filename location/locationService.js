const Geo = require('geo-nearby');
const cacheService = require('../cache/cacheService');

function filterLocation(content, long, lati){
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lon'});
    const geo = new Geo(dataSet, {sorted: true});
    return geo.nearBy(lati, long, 500);
}

module.exports = {
    filterLocation,
}