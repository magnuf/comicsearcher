var resemble = require("resemble").resemble;
var fs = require("fs");
var Seq = require("seq");
var im = require('imagemagick');

fs.readdir("testcomics", function(err, files) {
  var matches = []
  if (err) { return; }
  for (var i =  0; i < files.length; i++) {
    matches.push([files[i], files.filter(function(file) {
      return file != files[i];
    })]);
  }

  var minWidth = 999999999999;

  im.identify('testcomics/'+matches[0][0], function(err, features){
    minWidth = Math.min(features.width, minWidth);

    im.identify('testcomics/'+matches[0][1][0], function(err, features){
      minWidth = Math.min(features.width, minWidth);
      // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }

      resizeOptions1 = {
        srcPath: 'testcomics/'+matches[0][0],
        dstPath: 'temp1.png',
        width:   minWidth,
        format: 'png'
      };

      resizeOptions2 = {
        srcPath: 'testcomics/'+matches[0][1][0],
        dstPath: 'temp2.png',
        width:   minWidth,
        format: 'png'
      };

      im.resize(resizeOptions1, function(err, stdout, stderr) {
        console.log("resized 1");
        im.resize(resizeOptions2, function(err, stdout, stderr) {
          console.log("resized 2");
          resemble("temp1.png")
          .compareTo("temp2.png")
          .ignoreColors()
          .onComplete(function(data) {
            console.log(data);
          });
        });
      });
    });
  });

return;

  Seq(matches)
    .seqEach(function(tuple) {
      var outerSeq = this;
      Seq(tuple[1])
        .seqEach(function(filename) {
          var key = tuple[0] + filename;
          var cb = this.into(key);
          var path = "comics/" + tuple[0],
              comparePath = "comics/" + filename;
          console.log('running', path, "comparing to", comparePath);
          resemble(path)
            .compareTo(comparePath)
            .ignoreColors()
            .onComplete(function(data) {
              console.log(data);
              setTimeout(function () {
                cb(null, data);
              }, 0);
            });
        })
        .catch(function (err) {
          console.log('catch for seqEach', err);
        })
        .seq(function() {
          console.log('ok');
          console.log(this.vars);
          // if (this.data.misMatchPercentage < 25) {
          //      console.log("%s is duplicate of %s", files[j], files[i]);
          // }
          // console.log(data.misMatchPercentage);
          outerSeq.ok();
        })
        .catch(function (err) {
          console.log("err inner", err);
        });
    })
    .catch(function (err) {
      console.log("err outer", err)
    });
});
