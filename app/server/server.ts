import SerialPort, { list } from 'serialport'
import * as url from 'url'
import * as WebSocket from 'ws'

const options = {
	port: 31130
}

type RawMessage = {
	prefix?: string // The prefix for the message (optional)
	nick?: string // The nickname portion of the prefix (optional)
	user?: string // The username portion of the prefix (optional)
	host?: string // The hostname portion of the prefix (optional)
	server: string // The servername (if the prefix was a servername)
	rawCommand: string // The command exactly as sent from the server
	command: string // Human readable version of the command
	commandType: 'normal'|'error'|'reply'// normal, error, or reply
	args: string[] // arguments to the command
}

export type WSMessage = {
	type: 'IRC'|'SERVER'
	data: string
}

export type ClientMessage = {
	channel: string
	message: string
}

const wss = new WebSocket.Server(options)
console.log(`Listening for websocket connections on port ${options.port}`)

wss.on('connection', (ws, req) => {
	const send = (message: WSMessage) => ws.send(JSON.stringify(message), err => err && console.error(err))

	const { mode, baud, device } = url.parse(req.url, true).query
	const baudrate = Number.parseInt(typeof baud === 'string' && baud, 10)

	if (mode === 'LIST') {
		setInterval(() => {
			const devices = SerialPort.list()
			ws.send(devices)
		}, 1000)
	} else if (mode === 'CONNECT')  {
		if (typeof device !== 'string' || isNaN(baudrate))
			return

		const serial = new SerialPort(device, { baudRate: baudrate })

		serial.on('error', (data: unknown) => {
			ws.send(data)
		})
	}

	ws.onmessage = (message) => {

	}
})

wss.on('error', (error) => {
	console.warn(error)
})

export default wss
