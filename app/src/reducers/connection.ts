import { Action } from 'actions'

export enum ConnState {
	CONNECTING,
	CONNECTED,
	DISCONNECTED
}

export default function (state: ConnState = ConnState.DISCONNECTED, action: Action): ConnState {
	switch (action.type) {
		case 'DEVICE_LIST':
			return ConnState.CONNECTING

		case 'DEVICE_LIST_SUCCESS':
			return ConnState.CONNECTED

		case 'DEVICE_LIST_ERROR':
			return ConnState.DISCONNECTED

		default:
			return state
	}
}
