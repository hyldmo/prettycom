import Server from './server'

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const server = new Server({ port: 31130 })

server.on('error', (error) => {
	console.warn('Server error:', error)
})

window.onbeforeunload = () => {
	server.close()
}
