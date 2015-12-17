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

    signedRequest.post("/comics/_search", doc)
        .then(function (result) {
            context.succeed(prepareResult(JSON.parse(result)));
        })
        .catch(function (error) {
            console.error(error);
            context.fail("Something went wrong.");
        });
}

function prepareResult (result) {
    return result.hits.hits.map(function (hit) {
        return { image: hit._source.url };
    });
}