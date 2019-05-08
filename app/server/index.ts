import SerialPort, { PortInfo } from 'serialport'
import { setInterval } from 'timers'
import * as url from 'url'
import * as WebSocket from 'ws'

const mock: PortInfo & { path: string } = {
	path: '/dev/tty.usbmodem1421',
	comName: 'COM_DEMO',
	manufacturer: 'Arduino (www.arduino.cc)',
	serialNumber: '752303138333518011C1',
	locationId: '14200000',
	vendorId: '2341',
	productId: '0043'
}

function log (level: keyof typeof console, ...args: any[]) {
	console[level]('Server: ', ...args)
}

export default class Server {
	public wss: WebSocket.Server
	public on: WebSocket.Server['on']
	public close: WebSocket.Server['close']

	private devices: PortInfo[] = []
	private connected: SerialPort[] = []

	constructor (options: WebSocket.ServerOptions) {
		this.wss = new WebSocket.Server(options)
		this.on = this.wss.on
		this.close = (cb?: (err?: Error) => void) => {
			this.connected.forEach(serial => serial.close())
			return this.wss.close(cb)
		}

		log('info', `Listening for websocket connections on port ${options.port}`)

		this.wss.on('connection', (ws, req) => {
			// const send = (message: object) => ws.send(JSON.stringify(message), err => err && console.error(err))
			const { mode, baud, device } = url.parse(req.url || '', true).query
			const baudrate = Number.parseInt(baud as any, 10)

			const ping = setInterval(ws.ping, 10 * 1000)
			ws.on('close', () => clearInterval(ping))

			this.wss.on('error', ws.close)

			if (mode === 'LIST') {
				const int1 = setInterval(async () => {
					const devices = await SerialPort.list()
					devices.forEach(a => {
						if (!this.devices.find(b => a.comName === b.comName)) {
							this.devices.push(a)
							ws.send(`ADD:${JSON.stringify(a)}`)
						}
					})
				}, 100)
				const int2 = setInterval(() => {
					ws.send(`ADD:${JSON.stringify(mock)}`)
				}, 100)

				ws.addEventListener('close', () => {
					clearInterval(int1)
					clearInterval(int2)
				})

			} else if (mode === 'CONNECT')  {
				if (typeof device !== 'string' || isNaN(baudrate)) {
					ws.close(1007, 'Invalid parameters')
					return
				}

				if (device === mock.comName) {
					setInterval(async () => {
						ws.send(`GT ${new Date().getTime()}\n`)
					}, 1000)
					return
				}

				const serial = new SerialPort(device, { baudRate: baudrate })
				log('info', `Device ${device} opened`)

				serial.on('data', (data: Blob) => {
					ws.send(data.toString())
				})

				ws.addEventListener('message', (message) => {
					log('info', 'Sending message', message)

					serial.write(message.data.toString())
				})

				ws.addEventListener('close', event => {
					if (serial.isOpen)
						serial.close()
				})

				serial.on('error', (data: object) => {
					log('error', data)
					ws.send(data.toString())
					ws.close(1008, data.toString())
				})

				this.wss.on('error', error => {
					log('error', error)
					if (serial.isOpen)
						serial.close()
				})
			} else {
				ws.close(1007, 'Invalid mode')
			}
		})

	}
}
