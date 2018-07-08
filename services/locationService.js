const Geo = require('geo-nearby');

// Takes in array of restaurants and filters it according to long and lat.
// Returns filtered array of restaurant IDs.
async function filterLocation(content, long, lati){
    console.log(`Filtering by long: ${long}, lati: ${lati}.`);
    const dataSet = Geo.createCompactSet(content, {id: '_id', lat: 'lat', lon: 'lng'});
    //console.log(`dataSet: ${dataSet}`);
    const geo = new Geo(dataSet, {sorted: true});
<<<<<<< HEAD:location/locationService.js
    const nearby = geo.nearBy(lati, long, 5000);
    var arr = [];
    for(var x of nearby) {
        value = await cacheService.get(cacheService.cacheTables.ID, x["i"]);
        arr.push(value);
        console.log(value);
    }
    //console.log(`Filtered location array: ${arr}`);
    return arr;
=======
    const nearby = geo.nearBy(lati, long, 15000);
    return nearby;
>>>>>>> dev_mlab:services/locationService.js
}

module.exports = {
    filterLocation,
}