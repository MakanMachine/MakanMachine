const dialogflow = require('dialogflow');

const PROJECT_ID = 'makanmachine-7c1bb';
const LANGUAGE_CODE = 'en-US';

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
  },
});

/**
 * Send message to DialogFlow to get detect intent.
 *
 * @param {string} chatId
 * @param {string} message
 *
 * @public
 *
 * @returns {{}} Intent Object
 */
async function postMessage(chatId, message) {
  try {
    const sessionId = chatId.toString();
    const sessionPath = sessionClient.sessionPath(PROJECT_ID, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: LANGUAGE_CODE,
        },
      },
    };
    const response = await sessionClient.detectIntent(request);
    return response[0].queryResult;
  } catch (error) {
    logger.cm.err(`Dialogflow Error: ${error}`);
  }
  return null;
}

module.exports = {
  postMessage,
};
