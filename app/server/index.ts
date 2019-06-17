import SerialPort, { PortInfo } from 'serialport'
import { setInterval } from 'timers'
import * as url from 'url'
import * as WebSocket from 'ws'

const mock: PortInfo = {
	comName: 'COM_DEMO',
	manufacturer: 'ACME',
	serialNumber: '1904321930',
	locationId: '31245',
	vendorId: '7653',
	productId: '0321'
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
					const newDevices = await SerialPort.list()

					newDevices
						.filter(a => !this.devices.find(b => a.comName === b.comName))
						.forEach(a => ws.send(`ADD:${JSON.stringify(a)}`))
					this.devices
						.filter(a => !newDevices.find(b => a.comName === b.comName))
						.forEach(a => ws.send(`REMOVE:${JSON.stringify(a)}`))

					this.devices = newDevices
				}, 100)
				const int2 = setInterval(() => {
					ws.send(`ADD:${JSON.stringify(mock)}`)
				}, 100)

				ws.onclose = () => {
					clearInterval(int1)
					clearInterval(int2)
				}

			} else if (mode === 'CONNECT')  {
				if (typeof device !== 'string' || isNaN(baudrate)) {
					ws.close(1007, 'Invalid parameters')
					return
				}

				if (device === mock.comName) {
					setInterval(async () => {
						ws.send(`Time ${Math.round(new Date().getTime() / 1000)}\n`)
					}, 1000)

					ws.onmessage = message => {
						ws.send(`Received: ${message.data.toString()}`)
					}
					return
				}

				const serial = new SerialPort(device, { baudRate: baudrate })
				log('info', `Device ${device} opened`)

				serial.on('data', (data: Blob) => {
					ws.send(data.toString())
				})

				ws.onmessage = message => {
					log('info', 'Sending message', message.data)

					serial.write(message.data.toString())
				}

				ws.onclose = event => {
					if (serial.isOpen)
						serial.close()
				}

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
