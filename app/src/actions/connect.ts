import { PortInfo } from 'serialport'
import { Message, SerialDevice, SerialOptions } from '../types'
import { createAction } from './actionCreator'

export default {
	connect: createAction<'CONNECT', SerialOptions>('CONNECT'),
	connecting: createAction<'CONNECTING', null, PortInfo['path']>('CONNECTING'),
	connected: createAction<'CONNECTED', null, PortInfo['path']>('CONNECTED'),
	disconnect: createAction<'DISCONNECT', null, PortInfo['path']>('DISCONNECT'),
	disconnected: createAction<'DISCONNECTED', null, PortInfo['path']>('DISCONNECTED'),
	listDevices: createAction<'DEVICE_LIST'>('DEVICE_LIST'),
	addDevice: createAction<'DEVICE_ADD', PortInfo, PortInfo['path']>('DEVICE_ADD'),
	removeDevice: createAction<'DEVICE_REMOVE', PortInfo, SerialDevice['path']>('DEVICE_REMOVE'),
	sendMessage: createAction<'DEVICE_MSG', string, SerialDevice['path']>('DEVICE_MSG'),
	dataReceived: createAction<'DEVICE_DATA_RECEIVED', Message, string>('DEVICE_DATA_RECEIVED'),
	clearConsole: createAction<'DEVICE_CLEAR_MESSAGES', null, SerialDevice['path']>('DEVICE_CLEAR_MESSAGES')
}
