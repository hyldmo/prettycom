import { PortInfo } from 'serialport'

export type SerialOptions = {
	baud: number
	device: string
}

export type Message = {
	content: string
	timestamp: Date
}

export type SerialDevice = PortInfo & {
	connected: boolean
	messages: Message[]
}
