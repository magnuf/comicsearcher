var request = require("request");
var fs = require("fs");
var urls = ['/lunchdb', '/lunch', '/lunche24', '/lunchtu'];
var sessionid ='ycww3360ysh33kw6eygbvo5g9utrpkid';
var baseUrl = 'https://comics.io';

for (var i = 0; i < urls.length; i++) {
  crawl(urls[i]);
}

function crawl(url) {
  var options = {
    url: baseUrl + url,
    headers : {
      "Cookie": "sessionid="+sessionid
    }
  };

  var imgUrlregex = /<img src="(.*?)".*?alt="([^"]*?)"/;
  var previousRegex = /<a href="([^"]*?)" class="[^"]*?" id="prev"/;
  var extensionRegex = /.+\.([^?]+)(\?|$)/;

  function crawl(error, response, body) {
    if (!error && response.statusCode == 200) {
      var imgUrl = imgUrlregex.exec(body);
      var imgDate = imgUrl[2].split(" ")[1].replace("/", "-") +"."+ extensionRegex.exec(imgUrl[1])[1];
      var prevImg = previousRegex.exec(body);
      var path = "comics/" + imgDate;

      try {
        fs.accessSync(path);
        console.log("Already downloaded this comic, and subsequent ones if crawler has been run correctly.")
        return;
      } catch(ex) {

      }
      request(imgUrl[1]).pipe(fs.createWriteStream(path));
      if(!prevImg) { return; }
      url = baseUrl + prevImg[1];
      options.url = url;
      request(options, crawl);
    }
  }

  request(options, crawl);
}
