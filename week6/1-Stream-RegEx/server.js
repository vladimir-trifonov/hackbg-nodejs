var request = require("request"),
	http = require('http'),
	fs = require('fs'),
	RegexTranform = require('./transform').RegexTransform;

function createParser() {
    var parser =  new RegexTranform({objectMode: true}, new RegExp(/(.*)Brooklyn(.*)/g));        
    return parser;
}

 request("http://nodestreams.com/input/people_utf8.csv")
	.pipe(createParser())
	//.pipe(fs.createWriteStream("./output/people.txt"))
	.pipe(process.stdout);


