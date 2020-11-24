import { PortInfo } from 'serialport'
import { Message, SerialDevice, SerialOptions } from '../types'
import { actionCreator } from './actionCreator'

export default {
	connect: actionCreator<'CONNECT', SerialOptions>('CONNECT'),
	connecting: actionCreator<'CONNECTING', null, PortInfo['path']>('CONNECTING'),
	connected: actionCreator<'CONNECTED', null, PortInfo['path']>('CONNECTED'),
	disconnect: actionCreator<'DISCONNECT', null, PortInfo['path']>('DISCONNECT'),
	disconnected: actionCreator<'DISCONNECTED', null, PortInfo['path']>('DISCONNECTED'),
	listDevices: actionCreator<'DEVICE_LIST'>('DEVICE_LIST'),
	addDevice: actionCreator<'DEVICE_ADD', PortInfo, PortInfo['path']>('DEVICE_ADD'),
	removeDevice: actionCreator<'DEVICE_REMOVE', PortInfo, SerialDevice['path']>('DEVICE_REMOVE'),
	sendMessage: actionCreator<'DEVICE_MSG', string, SerialDevice['path']>('DEVICE_MSG'),
	dataReceived: actionCreator<'DEVICE_DATA_RECEIVED', Message, string>('DEVICE_DATA_RECEIVED'),
	clearConsole: actionCreator<'DEVICE_CLEAR_MESSAGES', null, SerialDevice['path']>('DEVICE_CLEAR_MESSAGES'),
	updateName: actionCreator<'DEVICE_UPDATE_NAME', string, SerialDevice['path']>('DEVICE_UPDATE_NAME')
}
