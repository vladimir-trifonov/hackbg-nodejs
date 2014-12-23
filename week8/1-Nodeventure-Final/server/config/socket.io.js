var entity = require("../entity");
var counter = 0;

module.exports = function(io, engine) {
	io.sockets.on("connection", function(socket) {
		socket.unit = null;
		socket.on("connectServer", function(data, reply) {
			var unit = new entity.Unit({
				id: counter++,
				position: {x:0, y:0}
			});
			engine.addUnit(unit);
		});
	});
}