var signedRequest = require("./signedRequest");

exports.handler = function (event, context) {
    var query = event.query.toLowerCase();

    var doc = {
       "query": { 
           "bool": {
               "should": [
                  {
                       "fuzzy": {
                           "ocrtext" : {
                               "value": query
                           }
                       }
                   },
                   {
                       "fuzzy": {
                           "correctedtext" : {
                               "value": query
                           }
                       }
                   }
               ]
           }
       }
    }
        

    signedRequest.post("comics/_search", doc);
        .then(function (result) {
            context.succeed(result);
        })
        .catch(function (error) {
            context.fail();
        });
}