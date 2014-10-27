var argv = require('minimist')(process.argv.slice(2)),
	clientApi = require("./client-api");

var handler = null;

Object.keys(argv).some(function(key) {
	if(argv.hasOwnProperty(key) && key !== "_") {
		if(clientApi.hasOwnProperty(key)) {
			handler = clientApi[key];
			return true;
		}
	}	
});

if(handler) {
	handler(argv, function(err) {
		if(err) {
			console.log("Err: " + err);
		}
	});
}
