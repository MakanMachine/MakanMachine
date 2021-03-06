const Geo = require('geo-nearby');

// Takes in array of restaurants and filters it according to long and lat.
// Returns filtered array of restaurant IDs.
async function filterLocation(content, long, lati) {
    console.log(`Filtering by long: ${long}, lati: ${lati}.`);
    if(content == undefined) {
        return [];
    }
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lng'});
    console.log(`dataSet: ${dataSet}`);
    const geo = new Geo(dataSet, {sorted: true});
    const nearby = geo.nearBy(lati, long, 2000);
    return nearby;
}

module.exports = {
    filterLocation,
}