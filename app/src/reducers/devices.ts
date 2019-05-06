import { Action } from 'actions'
import { SerialDevice } from 'types'

export type DevicesState = SerialDevice[]

const initialState: DevicesState = []

export function device (state: SerialDevice, action: Action): SerialDevice {
	if (state.comName !== action.meta)
		return state

	switch (action.type) {
		case 'DEVICE_ADD':
			return {
				...state,
				available: true
			}

		case 'DEVICE_REMOVE':
			return {
				...state,
				available: false
			}

		case 'DISCONNECT':
			return {
				...state,
				connected: false
			}

		case 'CONNECTED':
			return {
				...state,
				connected: true
			}

		case 'DEVICE_DATA_RECEIVED':
			return {
				...state,
				messages: state.messages.concat(action.payload)
			}

		default:
			return state
	}
}

export default function (state: DevicesState = initialState, action: Action): DevicesState {
	switch (action.type) {
		case 'DEVICE_ADD':
			if (state.some(s => s.comName === action.payload.comName))
				return state.map(d => device(d, action))
			else
				return [
					...state,
					{
						...action.payload,
						available: true,
						connected: false,
						messages: []
					}
				]

		case 'CONNECTED':
		case 'DISCONNECT':
		case 'DEVICE_REMOVE':
		case 'DEVICE_DATA_RECEIVED':
			return state.map(d => device(d, action))
		default:
			return state
	}
}
