var AWS = require('aws-sdk');
var config = require('./config.json');

var endpoint =  new AWS.Endpoint(config.esUrl);

var doc = {
   "query": {
      "match_all": {},
   },
  "size": 5000
};

var doc = {
       "query": { 
            "multi_match": {
                "fields": ["ocrtext", "correctedtext"],
                "query": "hms",
                "minimum_should_match": "80%"
            }
       }
    }

function findduplicates (results) {
  counter = {}
  results = JSON.parse(results);
  results.hits.hits.forEach(function(obj){
    key = obj._source.ocrtext;
    if(counter[key]){
      counter[key].push({uuid: obj._source.uuid, name: obj._source.filename});
    } else {
      counter[key] = [obj._source.uuid];
    }
  });

  var vals = Object.keys(counter).map(function (key) {
    return counter[key];
  });
  var filtered =  vals.filter(function(val){ return ( val.length > 1 && val.length < 5)}); //Only got comics from 4 sources
  console.log("Duplicates found: " + filtered.length)
  console.log(filtered); //Only got comics from 4 sources
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
    console.log(body);
    // findduplicates(body);
  });
});