//Modified https://developers.google.com/drive/web/quickstart/nodejs
//Read instructions there to get set up

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var request = require("request");
var EE = require("eventemitter3");
var EventEmitter = new EE();


var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
var authClient;
// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      authClient = oauth2Client;
      EventEmitter.emit("authed")
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      authClient = oauth2Client;
      EventEmitter.emit("authed")
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function uploadFile(path) {
  var drive = google.drive({ version: 'v2', auth: authClient });
  drive.files.insert({
    resource: {
      title: 'testimage'
    },
    ocr: true,
    ocrLanguage: "no",
    media: {
      mimeType: "image/png", //Just set a mimeType, so that OCR works
      body: fs.createReadStream(path) // read streams are awesome!
    }
  }, function(err, data) {
    if(err) { return; }
    return getText(data)
  });
}

function getText(fileData) {
  var url = fileData.exportLinks['text/plain'];
  request.get(url, {
    'auth' : {
      'bearer': authClient.credentials.access_token
    }
  }, function(error, response, body) {
    deleteFile(fileData.id)
    return body;
  });
}

function deleteFile(fileId) {
  var drive = google.drive({ version: 'v2', auth: authClient });
  drive.files.delete({
    fileId: fileId
  }, null);
}

module.exports = {
  events: EventEmitter,
  runOcr: uploadFile
}
