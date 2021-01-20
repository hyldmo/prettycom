import SerialPort, { PortInfo } from 'serialport'
import { setInterval } from 'timers'
import * as url from 'url'
import * as WebSocket from 'ws'
import { COM_MOCK } from './constants'
import { DeviceLogger } from './DeviceLogger'
import log from './log'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RegexParser = require('@serialport/parser-regex')

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
			const query = url.parse(req.url || '', true).query
			const { mode } = query
			const ping = setInterval(() => ws.ping(), 5 * 1000)
			ws.on('close', () => clearInterval(ping))

			this.on('error', err => {
				log('error', err)
				ws.close(1011, err.toString())
			})

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
				const { baud, device , delimiter } = query
				const baudrate = Number.parseInt(baud as any, 10)
				if (typeof device !== 'string' || isNaN(baudrate)) {
					ws.close(1007, 'Invalid parameters')
					return
				}

				if (device === COM_MOCK.path) {
					setInterval(async () => {
						const str = `Time ${Math.round(new Date().getTime() / 1000)}`
						ws.send(str)
					}, 1000)

					ws.on('message', message => {
						ws.send(`Received: ${message.toString()}`)
					})

				} else {
					const existing = this.connected.find(d => d.path == device)
					const serial = existing || new SerialPort(device, { baudRate: baudrate })
					log('info', `Device ${device} opened`)

					const emitter = delimiter
						? new RegexParser({ regex: new RegExp(decodeURI(delimiter as string)) })
						: serial
					if (delimiter) serial.pipe(emitter)

					emitter.on('data', (data: any) => {
						ws.send(data.toString())
					})
					ws.on('message', message => {
						log('info', 'Sending message', message)
						serial.write(message.toString())
					})

					if (!existing) {
						this.connected.push(serial)

						ws.on('close', () => {
							this.connected = this.connected.filter(d => d.path !== serial.path)
							if (serial.isOpen)
								serial.close()
						})

						serial.on('close', data => {
							log('info', `Serial port at <${serial.path}> closed. Message: ${data?.toString()}`)
							this.connected = this.connected.filter(d => d.path !== serial.path)
							if (data)
								ws.close(1014, data.toString())
						})

						serial.on('error', data => {
							log('error', data)
							ws.close(1014, data?.toString())
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
