import SerialPort, { PortInfo } from 'serialport'
import * as url from 'url'
import * as WebSocket from 'ws'

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

		console.log(`Listening for websocket connections on port ${options.port}`)

		this.wss.on('connection', (ws, req) => {
			// const send = (message: object) => ws.send(JSON.stringify(message), err => err && console.error(err))

			const { mode, baud, device } = url.parse(req.url || '', true).query
			const baudrate = Number.parseInt(baud as any, 10)

			if (mode === 'LIST') {
				setInterval(async () => {
					const devices = await SerialPort.list()
					devices.forEach(a => {
						if (!this.devices.find(b => a.comName === b.comName)) {
							this.devices.push(a)
							ws.send(`ADD:${JSON.stringify(a)}`)
						}
					})
				}, 1000)
			} else if (mode === 'CONNECT')  {
				if (typeof device !== 'string' || isNaN(baudrate))
					return

				const serial = new SerialPort(device, { baudRate: baudrate })

				serial.on('error', (data: unknown) => {
					console.error(data)
					ws.send(data)
				})

				serial.on('data', (data: Blob) => {
					ws.send(data.toString())
				})

				ws.onmessage = (message) => {
					serial.write(message.data.toString())
				}
			}
		})
	}
}
