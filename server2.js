const net = require("net");

const server = net.createServer();

server.on("connection", (socket) => {
	socket.on("ready", (buf) => {
		console.log("ready", buf);
	});
	socket.on("lookup", (buf) => {
		console.log("lookup", buf);
	});
	socket.on("connect", (buf) => {
		console.log("connect", buf);
	});
	socket.on("data", (buf) => {
		console.log("data", buf);
	});
	socket.on("timeout", (buf) => {
		console.log("timeout", buf);
	});
});

server.listen(5000);
