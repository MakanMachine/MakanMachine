const dfCaller = require('../api_caller/dialogflowCaller');
const is = require('is_js');
const cHandler = require('./commandHandler');
const rHandler = require('./replyHandler');
const tgCaller = require('../api_caller/telegram_caller');

async function handleIntent(chatID, dfQueryResult, userQuery, msgObj) {
    console.log(`Handling DF Query Result: ${JSON.stringify(dfQueryResult)}`);
    try {
        if (is.propertyDefined(dfQueryResult, 'intent')) {
            const intentName = dfQueryResult.intent.displayName;
            switch (intentName) {
                case 'Default Fallback Intent':
                const fallbackMessage = `Sorry, I can't understand what you just said. Try typing /help to view some of the commands you can use.`;
                await tgCaller.sendMessage(chatID, fallbackMessage);
                break;
                
                case 'recommend_cuisine':
                await rHandler.handleReplyIntent(chatID, msgObj.chat.first_name, {text: `${dfQueryResult.parameters.cuisine} n`, type: 'recommend'});
                break;

                case 'recommend_cuisine_location':
                await rHandler.handleReplyIntent(chatID, msgObj.chat.first_name, {text: `${dfQueryResult.parameters.cuisine} y`, type: 'recommend'});
                break;

                case 'surprise_me':
                await cHandler.handleCommand(chatID, msgObj, 'surprise_me');
                break;
                
                default:
                await tgCaller.sendMessage(chatID, dfQueryResult.fulfillmentText);
                break;
            }
        } else if (is.propertyDefined(dfQueryResult, 'fulfillmentText') && dfQueryResult.fulfillmentText !== '') {
            await tgCaller.sendMessage(chatID, dfQueryResult.fulfillmentText);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  handleIntent,
};