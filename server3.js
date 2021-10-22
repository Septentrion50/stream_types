const net = require("net");
const Transform = require("stream").Transform;
const server = net.createServer();

server.on("connection", (socket) => {
	let buffer;
	socket.on("data", (buf) => {
		buffer = Buffer.concat([buffer, buf]);
	});
	socket.write(buffer.toString().toUpperCase());
});

server.listen(5000);
