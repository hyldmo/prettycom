import { PortInfo } from 'serialport'
import { Message, SerialOptions } from '../types'
import { createAction } from './actionCreator'

export default {
	connect: createAction<'CONNECT', SerialOptions>('CONNECT'),
	connecting: createAction<'CONNECTING', string>('CONNECTING'),
	connected: createAction<'CONNECTED', null, string>('CONNECTED'),
	disconnect: createAction<'DISCONNECT', null, PortInfo['comName']>('DISCONNECT'),
	listDevices: createAction<'DEVICE_LIST'>('DEVICE_LIST'),
	addDevice: createAction<'DEVICE_ADD', PortInfo, PortInfo['comName']>('DEVICE_ADD'),
	removeDevice: createAction<'DEVICE_REMOVE', PortInfo, PortInfo['comName']>('DEVICE_REMOVE'),
	sendMessage: createAction<'DEVICE_MSG', string, PortInfo['comName']>('DEVICE_MSG'),
	dataReceived: createAction<'DEVICE_DATA_RECEIVED', Message, string>('DEVICE_DATA_RECEIVED')
}
