const net = require("net");
const createWebServer = (requestHandler) => {
	const server = net.createServer();
	server.on("connection", (socket) => {
		//
		socket.once("readable", () => {
			let reqBuffer = Buffer.from("");
			let buff;
			let reqHeader;

			while (true) {
				buff = socket.read();
				if (!buff) break;
				reqBuffer = Buffer.concat([reqBuffer, buff]);
				let marker = reqBuffer.indexOf("\r\n\r\n");
				if (marker !== -1) {
					const remaining = reqBuffer.slice(marker + 4);
					reqHeader = reqBuffer.slice(0, marker).toString();
					//re put remaining in socket
					socket.unshift(remaining);
					break;
				}
			}
			const reqheaders = reqHeader.split("\r\n");
			const reqLine = headers.shift().split(" ");

			const headers = reqheaders.reduce((acc, stringy) => {
				const [key, value] = stringy.split(":");
				return {
					...acc,
					[key.trim().toLowerCase()]: value.trim(),
				};
			}, {});
			const req = {
				method: reqLine[0],
				url: reqLine[1],
				httpVersion: reqLine[2].split("/")[1],
				headers,
				socket,
			};
			const status = 200;
			const statusText = "OK";
			const headersSent = false;
			const isChunked = false;
			const resHeaders = { server: "MySeRvEr" };
			function writeHeader(key, value) {
				resHeaders[key.toLowerCase()] = value;
			}
			const sendHeader = () => {
				if (!headersSent) {
					headersSent = true;
					writeHeader("date", new Date().toUTCString());
					socket.write(`HTTP/1.1 ${status} ${statusText}\r\n`);
					Object.keys(resHeaders).forEach((key) => {
						socket.write(`${key}, ${resHeaders[key]}\r\n`);
					});
					socket.write(`\r\n`);
				}
			};
			const response = {
				write(chunk) {
					if (!headersSent) {
						if (!resHeaders["content-length"]) {
							isChunked = true;
							setHeader("transfer-encoding", "chunked");
						}
						sendHeader();
					}
					if (isChunked) {
						const size = chunk.length.toString(16);
						socket.write(`${size}\r\n`);
						socket.write(chunk);
						socket.write(`\r\n`);
					} else {
						socket.write(chunk);
					}
				},
				end(chunk) {
					if (!headersSent) {
						if (!resHeaders["content-length"]) {
							setHeader("content-length", chunk ? chunk.lenght : 0);
						}
						sendHeader();
					}
					if (isChunked) {
						if (chunk) {
							const size = chunk.length.toString(16);
							socket.write(`${size}\r\n`);
							socket.write(chunk);
							socket.write(`\r\n`);
						}
						socket.end("0\r\n\r\n");
					} else {
						socket.end(chunk);
					}
				},
				setHeader,
				setStatus(newStatus, newStatusText) {
					status = newStatus;
					statusText = newStatusText;
				},
				json(data) {
					if (headersSent) {
						throw new Error("Headers sent, cannot proceed to send json.");
					}
					const json = new Buffer(JSON.stringify(data));
					setHeader("content-type", "application/json; charset=utf-8");
					setHeader("content-length", json.length);
					sendHeaders();
					socket.end(json);
				},
			};
			requestHandler(req, response);
		});
		return {
			listen: (port) => {
				server.listen(port);
			},
		};
	});
};
const webserver = createWebServer((req, response) => {
	console.log(`${new Date().toUTCString()}`);
	console.log(req.url);
	console.log(req.method);
	response.setHeader("Content-Type", "text/plain");
	response.end("Hello World");
});

webserver.listen(5000);
