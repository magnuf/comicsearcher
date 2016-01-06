var resemble = require("resemble-node-js");
var fs = require("fs");


fs.readdir("comics", function(err, files) {
	if(err) { return; }
	for (var i = files.length - 1; i >= 0; i--) {
		for (var j = files.length - 1; j >= 0; j--) {
			if ( i === j) { continue; }

			var diff = resemble("comics/"+files[i]).compareTo("comics/"+files[i]).ignoreColors().onComplete(function(data){
				if(data.misMatchPercentage < 25) {
					console.log("%s is duplicate of %s", files[j], files[i]);
				}
				console.log(data.misMatchPercentage);
		};
	};
});
