import { Action } from 'actions'
import { SerialDevice } from 'types'

export type DevicesState = SerialDevice[]

const initialState: DevicesState = []

export function device (state: SerialDevice, action: Action): SerialDevice {
	if (state.comName !== action.meta)
		return state

	switch (action.type) {

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
			return [
				...state,
				{
					...action.payload,
					connected: false,
					messages: []
				}
			]

		case 'CONNECTED':
		case 'DEVICE_DATA_RECEIVED':
			return state.map(d => device(d, action))
		default:
			return state
	}
}
