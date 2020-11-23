import { initialState, Settings } from 'reducers/settings'
import { Direction, Message, SerialDevice } from 'types'

export * from './actionCreator'

/**
 * Converts strings from snake case to camel case
 */
export const snakeToCamel = (str: string) =>
	str
		.split('-')
		.map(name => name.charAt(0).toUpperCase() + name.slice(1))
		.join(' ')

export function range (start: number, end?: number): number[] {
	if (end === undefined) {
		end = start
		start = 0
	}
	return new Array(Math.abs(end - start) + 1)
		.fill(start)
		.map((_, i) => _ + i * Math.sign(end as number))
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function showMessage (msg: Message, filters: Settings['filters'], showSent?: boolean): boolean {
	if (msg.direction === Direction.Sent)
		return !!showSent
	return !filters.some(filter => filter.test(msg.content))
}

export function selectHost (settings: Settings) {
	return settings.host || (settings.remotePort ? `localhost:${settings.remotePort}` : initialState.host)
}

export function logName (device: SerialDevice) {
	const name = (device.logname || device.name || device.path).split('/').join('_')
	return name.includes('.') ? name : `${name}.log`
}

export function deviceName (device: SerialDevice) {
	return (device.name || device.path)
}

