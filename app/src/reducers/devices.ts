import { Action } from 'actions'
import { Direction, SerialDevice } from 'types'

export type DevicesState = SerialDevice[]

const initialState: DevicesState = []

export function device (state: SerialDevice, action: Action): SerialDevice {
	if (state.path !== action.meta)
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

		case 'CONNECTED':
		case 'CONNECTING':
		case 'DISCONNECTED':
			return {
				...state,
				connState: action.type
			}

		case 'DEVICE_MSG':
			return {
				...state,
				history: state.history.reduce((a, b) => a.includes(b) ? a : [...a, b], [action.payload]),
				messages: state.messages.concat({
					content: action.payload,
					timestamp: new Date(),
					direction: Direction.Sent
				})
			}

		case 'DEVICE_DATA_RECEIVED':
			return {
				...state,
				messages: state.messages.concat(action.payload)
			}

		case 'DEVICE_CLEAR_MESSAGES':
			return {
				...state,
				messages: []
			}

		default:
			return state
	}
}

export default function (state: DevicesState = initialState, action: Action): DevicesState {
	switch (action.type) {
		case 'DEVICE_ADD':
			if (state.some(s => s.path === action.payload.path))
				return state.map(d => device(d, action))
			else
				return [
					...state,
					{
						...action.payload,
						available: true,
						connState: 'DISCONNECTED',
						messages: [],
						history: []
					}
				]

		case 'DEVICE_MSG':
		case 'CONNECTED':
		case 'CONNECTING':
		case 'DISCONNECTED':
		case 'DEVICE_REMOVE':
		case 'DEVICE_DATA_RECEIVED':
		case 'DEVICE_CLEAR_MESSAGES':
			return state.map(d => device(d, action))
		default:
			return state
	}
}
