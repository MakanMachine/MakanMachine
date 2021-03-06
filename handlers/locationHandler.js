const cService = require('../cache/cacheService');
const tgCaller = require('../api_caller/telegram_caller');
const rHandler = require('./restaurantHandler');
const userpref = require('../userpref');
const lService = require('../services/locationService');
const sService = require('../services/surpriseService');

async function handleSurpriseLocation(chatID, msgObj) {
    var message = await sService.surprise({chatID: chatID, location: msgObj.location});
    await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, message, {parse_mode: 'markdown'}).catch((error) => {
        console.log(error);
    });
}


async function handleRecommendLocation(chatID, msgObj) {
    var long = msgObj.location.longitude;
    var lati = msgObj.location.latitude;
    var session = await cService.get(cService.cacheTables.SESSION, chatID);
    const preference = session.preference;
    console.log("Preference updated:" + preference);
    const message = `Got it! Please wait while I get the list of restaurants!`;
    await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, message).catch((error) => {
        console.log(error);
    });
    try {
        const chatData = {chat_id: chatID};
        await rHandler.handleRestaurants(rHandler.types.START, chatData, {user_pref: preference, user_long: long, user_lati: lati})
    } catch (error) {
        console.log(error);
    }
}

async function handleUnknownLocation(chatID) {
    const message = 'Oops, something went wrong. Please try again!';
    await tgCaller.sendMessageWithReplyKeyboardRemoved(chatID, message).catch((error) => {
        console.log(error);
    });
}

async function handleLocation(chatID, msgObj) {
    var session = await cService.get(cService.cacheTables.SESSION, chatID);
    switch(session.type) {
        case 'cuisine':
            handleRecommendLocation(chatID, msgObj);
            break;
        case 'surprise':
            handleSurpriseLocation(chatID, msgObj);
            break;
        default:
            handleUnknownLocation(chatID);
            break;
    }
}

module.exports = {
    handleLocation,
}