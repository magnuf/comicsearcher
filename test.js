var ocr = require("./ocr");

console.time('noe');
ocr.events.on("authed", function(){

  var text = ocr.runOcr("test.gif", function(err, result){
  	console.log(result);
  	console.timeEnd('noe');
  });
});
