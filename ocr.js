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
var TOKEN_DIR = "./";
var TOKEN_PATH = TOKEN_DIR + 'drive_token.json';
var authClient;
// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets (err, content) {
  if (err) {
    console.log('Error loading client secret file:', err);
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
function authorize (credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    oauth2Client.credentials = JSON.parse(token);
    authClient = oauth2Client;
    EventEmitter.emit("authed");
  });
}

function uploadFile (path, callback) {
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
  }, function (err, data) {
    getText(data, callback);
  });
}

function getText (fileData, callback) {
  var url = fileData.exportLinks['text/plain'];
  request.get(url, {
    'auth' : {
      'bearer': authClient.credentials.access_token
    }
  }, function(error, response, body) {
    deleteFile(fileData.id);
    callback(error, body);
  });
}

function deleteFile (fileId) {
  var drive = google.drive({ version: 'v2', auth: authClient });
  drive.files.delete({
    fileId: fileId
  }, null);
}

module.exports = {
  events: EventEmitter,
  runOcr: uploadFile
};
