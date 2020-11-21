import {PortInfo} from 'serialport'

export type SerialOptions = {
	baud: number
	device: string
	url: string
}

export enum Direction {
	Sent,
	Received
}

export type Message = {
	content: string
	timestamp: Date
	direction: Direction
}

export type SerialDevice = PortInfo & {
	available: boolean
	connState: 'CONNECTED'|'CONNECTING'|'DISCONNECTED'
	messages: Message[]
	history: string[]
	logging: boolean
	logname: string
}
