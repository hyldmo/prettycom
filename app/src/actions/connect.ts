import { SerialOptions } from '../types'
import { createAction } from './actionCreator'

export default {
	connect: createAction<'CONNECT', SerialOptions>('CONNECT'),
	connecting: createAction<'CONNECTING', string>('CONNECTING'),
	connected: createAction<'CONNECTED', string>('CONNECTED'),
	listDevices: createAction<'LIST'>('LIST')
}
