var resemble = require("node-resemble-js");
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
					var cb = this.into(tuple[0] + filename);
					var diff = resemble("comics/"+tuple[0]).compareTo("comics/"+filename).ignoreColors().onComplete(function(data) { console.log("one down"); cb(null, data);});
				}).seq(function() {
					console.log(this.vars);
					this.ok();
						// if (this.data.misMatchPercentage < 25) {
						// 	console.log("%s is duplicate of %s", files[j], files[i]);
						// }
						// console.log(data.misMatchPercentage);
						// this.ok();
				})
				.seq(function(){ 				console.log("hei1"); outerSeq.ok()})
				// .catch(console.log.bind(console));
				.catch(function(err) {console.log("hei") });
		})
.catch(function() {console.log("hei2") });
		// .catch(console.log.bind(console));
});
