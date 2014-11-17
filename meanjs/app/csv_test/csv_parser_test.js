'use strict';
var parse = require('csv-parse');
var fs = require('fs');
require('should');
var output = [];
var parser = parse({delimiter:','})
var stream = fs.createReadStream('testData.csv').pipe(parser);
var str= "";
fs.readFile('testData.csv', function(err, data){
	 str = data.toString();
	 parse(input, {delimiter: ','}, function(err, output){
  		output.should.eql([ ['Title1','Title2','Title3'],['one','two','three'],['example1','example2','example3'] ]);
 		console.log(output);
	});
});


parser.on('readable', function(){
  while(stream = parser.read()){
    output.push(stream);
    // console.log(output);
  }
  // console.log(output);
});


parser.on('finish', function() {
	output.should.eql([
		['One','Two','Three'],
		['Four','Five','Six'],
		['Seven','Eight','Nine']
		]);
	// console.log(output);
});

