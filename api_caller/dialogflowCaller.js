const googleAuth = require('google-oauth-jwt');
const axios = require('axios');

const DIALOG_FLOW_HOST_V2 = 'https://dialogflow.googleapis.com/v2';
const PROJECT_ID = 'makanmachine-7c1bb';
const LANGUAGE_CODE = 'en-US';
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

/**
 * Returns a JWT token
 *
 * @private
 */
function generateAccessToken() {
  return new Promise((resolve, reject) => {
    googleAuth.authenticate(
      {
        // use the email address of the service account, as seen in the API console
        email: process.env.DIALOGFLOW_EMAIL,
        // use the PEM file we generated from the downloaded key
        key: JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY),
        // specify the scopes you wish to access
        scopes: SCOPES,
      },
      (err, token) => {
        if (err) {
          console.log(`token error: ${err}`);
          reject(err);
        }
        console.log(`token: ${token}`);
        resolve(token);
      },
    );
  });
}

/**
 * Returns a formatted detect API url.
 *
 * @param {string} sessionId
 *
 * @private
 */
function getDetectUrl(sessionId) {
  return `${DIALOG_FLOW_HOST_V2}/projects/${PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`;
}

/**
 * Send message to DialogFlow to get detect intent.
 *
 * @param {string} chatId
 * @param {string} message
 *
 * @public
 */
async function postMessage(chatId, message) {
  try {
    const accessToken = await generateAccessToken();
    const response = await axios({
      url: getDetectUrl(chatId),
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        queryInput: {
          text: {
            text: message,
            languageCode: LANGUAGE_CODE,
          },
        },
      },
    });
    return response.data.queryResult;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = {
  postMessage,
};
