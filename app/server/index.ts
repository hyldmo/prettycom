import SerialPort, { PortInfo } from 'serialport'
import { setInterval } from 'timers'
import * as url from 'url'
import * as WebSocket from 'ws'
import { COM_MOCK } from './constants'
import { DeviceLogger } from './DeviceLogger'
import log from './log'

export class Server extends WebSocket.Server {
	private connected: SerialPort[] = []

	constructor (options: WebSocket.ServerOptions) {
		super(options)
		this.on('close', () => {
			this.connected.forEach(serial => serial.close())
			this.connected = []
		})

		log('info', `Listening for websocket connections on port ${options.port}`)

		this.on('connection', (ws, req) => {
			// const send = (message: object) => ws.send(JSON.stringify(message), err => err && console.error(err))
			let devices: PortInfo[] = []
			const { mode } = url.parse(req.url || '', true).query
			const ping = setInterval(ws.ping, 10 * 1000)
			ws.on('close', () => clearInterval(ping))

			this.on('error', ws.close)

			if (mode === 'LIST') {
				const int1 = setInterval(async () => {
					const newDevices = await SerialPort.list()

					/* TODO: Consider just sending the full list altogether,
					 * instead of adding and removing individual devices */
					newDevices
						.forEach(a => ws.send(`ADD:${JSON.stringify(a)}`))
					devices
						.filter(a => !newDevices.find(b => a.path === b.path))
						.forEach(a => ws.send(`REMOVE:${JSON.stringify(a)}`))

					devices = newDevices
				}, 500)

				const int2 = setInterval(() => {
					ws.send(`ADD:${JSON.stringify(COM_MOCK)}`)
				}, 345)

				ws.on('close', () => {
					devices = []
					clearInterval(int1)
					clearInterval(int2)
				})
			} else if (mode === 'CONNECT')  {
				const { baud, device } = url.parse(req.url || '', true).query
				const baudrate = Number.parseInt(baud as any, 10)
				if (typeof device !== 'string' || isNaN(baudrate)) {
					ws.close(1007, 'Invalid parameters')
					return
				}

				if (device === COM_MOCK.path) {
					setInterval(async () => {
						const str = `Time ${Math.round(new Date().getTime() / 1000)}\n`
						for (const char of str) {
							ws.send(char)
						}
					}, 1000)

					ws.on('message', message => {
						ws.send(`Received: ${message.toString()}`)
					})
				} else {
					const existing = this.connected.find(d => d.path == device)
					const serial = existing || new SerialPort(device, { baudRate: baudrate })
					log('info', `Device ${device} opened`)

					serial.on('data', (data) => {
						ws.send(data.toString())
					})
					ws.on('message', message => {
						log('info', 'Sending message', message)
						serial.write(message.toString())
					})

					if (!existing) {
						this.connected.push(serial)

						serial.on('close', () => {
							this.connected = this.connected.filter(d => d.path !== serial.path)
						})

						serial.on('error', (data: object) => {
							log('error', data)
							ws.send(data.toString())
							ws.close(1008, data.toString())
							if (serial.isOpen)
								serial.close()
						})

						this.on('error', error => {
							log('error', error)
							if (serial.isOpen)
								serial.close()
						})
					}
				}
			} else if (mode === 'LOG') {
				const { filename } = url.parse(req.url || '', true).query
				const logger = new DeviceLogger(typeof filename === 'string' ? filename : filename[0])

				ws.on('message', msg => logger.write(msg.toString()))
				logger.onClose = () => ws.close()
				this.on('error', logger.close)
				ws.onclose = () => logger.close()
			} else {
				ws.close(1007, 'Invalid mode')
			}
		})

	}
}
