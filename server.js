const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
				const date = new Date().toString()
				console.log(`host: ${req.url}`)
				console.log(`method: ${req.method}`)
				console.log(`date: ${date}`)
				res.setHeader('Content-Type', 'text/plain')
				res.write('Hello world')
				res.end()
})

server.listen(5000)
