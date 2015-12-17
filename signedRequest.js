var AWS = require('aws-sdk');
var Promise = require('bluebird');

var config = require('./config.json');

var endpoint =  new AWS.Endpoint(config.esUrl);
var creds = new AWS.EnvironmentCredentials('AWS');

exports.post = post;

function post (url, doc) {

  return new Promise(function (resolve, reject) {

    var req = new AWS.HttpRequest(endpoint);
    req.path = url;
    req.body = JSON.stringify(doc);
    req.method = 'POST';
    req.region = "eu-west-1";
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
      httpResp.on('end', function () {
        resolve(body);
      });
    }, reject);
  });
}
