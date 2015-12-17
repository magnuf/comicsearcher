var signedRequest = require("./signedRequest");

exports.handler = function (event, context) {
    var query = decodeURIComponent(event.query.toLowerCase());

    var doc = {
       "query": { 
            "multi_match": {
                "fields": ["ocrtext", "correctedtext"],
                "query": query,
                "minimum_should_match": "80%"
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