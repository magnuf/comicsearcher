var resemble = require("resemble").resemble;
var fs = require("fs");
var Seq = require("seq");

fs.readdir("comics", function(err, files) {
  var matches = []
  if (err) { return; }
  for (var i =  0; i < files.length; i++) {
    if(files[i].endsWith(".gif")) { continue; }
    matches.push([files[i], files.filter(function(file) {
      return file != files[i] && file.endsWith(".png");
    })]);
  }

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
