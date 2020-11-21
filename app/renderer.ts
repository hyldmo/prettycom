import { ServerOptions } from 'ws'
import Server from './server'
import open from 'open'

import './src/types/globals'

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process

window.nodeOpen = open

window.onbeforeunload = () => {
	window.server?.close()
}

window.reloadServer = (options: ServerOptions) => {
	window.server?.close()

	console.info('Opening server ', options)
	window.server = new Server(options)

	window.server.on('error', (error) => {
		console.warn('Server error:', error)
	})
}
