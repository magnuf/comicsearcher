var AWS = require('aws-sdk');
var path = require('path');

var config = require('./config.json');

var data = {
  "image": "http://image.tld/asdasweadas.jpg",
  "tags": [
    "Bacon",
    "Øl"
  ],
  "characters": [
    "Kjell",
    "Bache"
  ],
  "ocrtext": "teksten skal inn her",
  "correctedtext": "dette kan være manuelt korrigert tekst, originalt samme som ocrtext"
};

var esDomain = {
  endpoint: config.esUrl,
  region: 'eu-west-1',
  index: 'comics',
  doctype: 'test'
};
var endpoint =  new AWS.Endpoint(esDomain.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');

exports.handler = function (event, context) {
  console.log('node version', process.version); // v0.10.36
  console.log('got s3 event', JSON.stringify(event, null, 2));
  console.log('works');

  event.Records.forEach(function (record) {
    var bucket = record.s3.bucket.name;
    var key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    console.log('bucket', bucket,
                'object key', key);

    postToEs(data, context);
  });
};

function postToEs (doc, context) {
  var req = new AWS.HttpRequest(endpoint);

  req.method = 'POST';
  req.path = path.join('/', esDomain.index, esDomain.doctype);
  req.region = esDomain.region;
  req.body = JSON.stringify(doc);
  req.headers['presigned-expires'] = false;
  req.headers['Host'] = endpoint.host;

  var signer = new AWS.Signers.V4(req, 'es');
  signer.addAuthorization(creds, new Date());

  var send = new AWS.NodeHttpClient();
  send.handleRequest(req, null, function (httpResp) {
    var body = '';
    httpResp.on('data', function (chunk) {
      body += chunk;
    });
    httpResp.on('end', function (chunk) {
      console.log('success', body);
      context.succeed();
    });
  }, function (err) {
    console.log('error', err);
    context.fail();
  });
}
