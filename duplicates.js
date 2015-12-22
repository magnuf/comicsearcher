var AWS = require('aws-sdk');
var config = require('./config.json');

var endpoint =  new AWS.Endpoint(config.esUrl);

var doc = {
   "query": {
      "match_all": {},
   },
  "size": 5000
};
function findduplicates (results) {
  counter = {}
  results = JSON.parse(results);
  results.hits.hits.forEach(function(obj){
    key = obj._source.ocrtext;
    if(counter[key]){
      counter[key].push(obj._source.uuid);
    } else {
      counter[key] = [obj._source.uuid];
    }
  });

  var vals = Object.keys(counter).map(function (key) {
    return counter[key];
  });

  console.log(vals.filter(function(val){ return val.length > 1}));
}



var req = new AWS.HttpRequest(endpoint);
req.path = "/_search";
req.body = JSON.stringify(doc);
req.method = 'POST';
req.region = "eu-west-1";
req.headers['presigned-expires'] = false;
req.headers['Host'] = endpoint.host;

var send = new AWS.NodeHttpClient();
send.handleRequest(req, null, function (httpResp) {
  var body = '';
  httpResp.on('data', function (chunk) {
    body += chunk;
  });
  httpResp.on('end', function () {
    findduplicates(body);
  });
});