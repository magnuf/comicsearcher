var AWS = require('aws-sdk');
var path = require('path');
var uuid = require('node-uuid');
var Promise = require('bluebird');

var ocr = require('./ocr');
var signedRequest = require('./signedRequest');

var s3 = new AWS.S3();

exports.handler = function (event, context) {

  event.Records.forEach(function (record) {
    var bucket = record.s3.bucket.name;
    var urlencodedKey = record.s3.object.key;
    console.log('event from bucket', bucket, 'with object key', urlencodedKey);

    var key = decodeURIComponent(urlencodedKey.replace(/\+/g, ' '));
    if (key.indexOf("/") === -1) {
      context.fail("All comics need to go in a folder. The folder is used as the doctype in ES");
    }

    var splitKey = key.split("/");
    var bucketFolder = splitKey[0];
    var bucketFilename = splitKey[1];

    var imageUuid = uuid.v4();
    var destination = {
      bucket: "bekkops-comicsearcher-www",
      key: "comics" + "/" + imageUuid
    };

    var eventObject = { Bucket: bucket, Key: key };
    var imageStream = s3.getObject(eventObject).createReadStream();

    runOcr(imageStream)
      .then(copyS3Object({
        CopySource: bucket + '/' + urlencodedKey,
        Bucket: destination.bucket,
        Key: destination.key
      }))
      .then(postToEs({
        uuid: imageUuid,
        url: "https://s3-eu-west-1.amazonaws.com/" + destination.bucket + "/" + destination.key,
        filename: bucketFilename,
        doctype: bucketFolder
      }))
      .then(deleteS3Object(eventObject))
      .then(function (results) {
        console.log(JSON.stringify(results));
        context.succeed();
      })
      .catch(function (err) {
        console.error(err);
        context.fail();
      });
  });
};

function runOcr (imageS3Stream) {
  return new Promise(function (resolve, reject) {
    ocr.events.on("authed", function () {
      ocr.runOcr(imageS3Stream, function (err, text) {
        if (err) {
          return reject(err);
        }
        var results = { ocrText: text };
        return resolve(results);
      });
    });
  });
}

function copyS3Object (params) {
  var paramsStr = JSON.stringify(params);

  return function (results) {

    return new Promise(function (resolve, reject) {

      s3.copyObject(params, function (err, data) {
        if (err) {
          var errMsg = "Could not move file " + paramsStr;
          console.error(err, errMsg);
          return reject(errMsg, err);
        }

        console.log("Moved file", paramsStr);
        return resolve(results);
      });
    });
  };
}

function postToEs (params) {

  return function (results) {

    var doc = {
      uuid: params.uuid,
      url: params.url,
      filename: params.filename,
      ocrtext: results.ocrText,
      correctedtext: clearOcrText(results.ocrText)
    };

    var url = path.join('/', "comics", params.doctype);

    return signedRequest.post(url, doc)
      .then(function (body) {
        results.esResponse = body;
        return results;
      });
  };
}

function deleteS3Object (params) {
  var paramsStr = JSON.stringify(params);

  return function (results) {

    return new Promise(function (resolve, reject) {

      s3.deleteObject(params, function (err, data) {
        if (err) {
          var errMsg = "Could not delete" + paramsStr;
          console.error(err, errMsg);
          return reject(errMsg, err);
        }
        console.log("Deleted uploaded", paramsStr);
        return resolve(results);
      });
    });
  };
}

function cleanOcrText (dirtyText) {
  return dirtyText
    .replace(/\r\n/g, " ")
    .replace(/[^a-zA-ZæøåÆØÅ0-9\s]/g, " ");
}
