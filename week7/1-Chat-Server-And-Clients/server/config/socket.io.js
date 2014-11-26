module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
		socket.emit('message', {message: 'Welcome!'});
		socket.on('send', function(data) {
			io.sockets.emit('message', data);
		})
	})
}