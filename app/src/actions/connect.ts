import { PortInfo } from 'serialport'
import { Message, SerialDevice, SerialOptions } from '../types'
import { createAction } from './actionCreator'

export default {
	connect: createAction<'CONNECT', SerialOptions>('CONNECT'),
	connecting: createAction<'CONNECTING', null, PortInfo['comName']>('CONNECTING'),
	connected: createAction<'CONNECTED', null, PortInfo['comName']>('CONNECTED'),
	disconnect: createAction<'DISCONNECT', null, PortInfo['comName']>('DISCONNECT'),
	disconnected: createAction<'DISCONNECTED', null, PortInfo['comName']>('DISCONNECTED'),
	listDevices: createAction<'DEVICE_LIST'>('DEVICE_LIST'),
	addDevice: createAction<'DEVICE_ADD', PortInfo, PortInfo['comName']>('DEVICE_ADD'),
	removeDevice: createAction<'DEVICE_REMOVE', PortInfo, SerialDevice['comName']>('DEVICE_REMOVE'),
	sendMessage: createAction<'DEVICE_MSG', string, SerialDevice['comName']>('DEVICE_MSG'),
	dataReceived: createAction<'DEVICE_DATA_RECEIVED', Message, string>('DEVICE_DATA_RECEIVED'),
	clearConsole: createAction<'DEVICE_CLEAR_MESSAGES', null, SerialDevice['comName']>('DEVICE_CLEAR_MESSAGES')
}
