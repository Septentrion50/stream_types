const net = require('net');
const server = net.createServer();
server.on("connection", (socket) => {
	//
	socket.once("readable", () => {
		let reqBuffer = Buffer.from('');
		let buff;
		let reqHeader;

		while (true) {
			buff = socket.read()
			if (!buff) break
			reqBuffer = Buffer.concat([reqBuffer, buff]);
			let marker = reqBuffer.indexOf("\r\n\r\n")
			if (marker !== -1) {
				const remaining = reqBuffer.slice(marker + 4)
				reqHeader = reqBuffer.slice(0, marker).toString()
				//re put remaining in socket
				socket.unshift(remaining);
				break;
			}

		}
		const reqheaders = reqHeader.split('\r\n');
		const reqLine = headers.shift().split(' ');

		const headers = reqheaders.reduce((acc, stringy) => {
			const [key, value] = stringy.split(":");
			return { ...acc, [key.trim().toLowerCase()]: value.trim() }
		}, {})
		const req = {
			method:reqLine[0],
			url:reqLine[1],
			httpVersion:reqLine[2].split("/")[1],
			headers,
			socket
		}
		const status = 200;
		const statusText = "OK";
		const headersSent = false;
		const isChunked = false;
		const resHeaders = {server:"MySeRvEr"}
		function writeHeader(key,value){
			resHeaders[key.toLowerCase()] = value
		}
		const sendHeader = () =>{
			if(!headersSent){
				headersSent = true;
				writeHeader('date', new Date().toUTCString())
				socket.write(`HTTP/1.1 ${status} ${statusText}\r\n`)
				Object.keys(resHeaders).forEach( key =>{
					socket.write(`${key}, ${resHeaders[key]}\r\n`)
				})
				socket.write(`\r\n`);
			}
			
		}
		const response = {};
	})
})
// souscrire a l'event lisible - read x
// 
//  recevoir les headers, les parsers
//  


server.listen(8000);
