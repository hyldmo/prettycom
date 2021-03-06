import { Action, MetaAction } from 'actions'
import { Direction, SerialDevice } from 'types'

export type DevicesState = SerialDevice[]

const initialState: DevicesState = []

export function device (state: SerialDevice, action: MetaAction): SerialDevice {
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
				available: false,
				connState: 'DISCONNECTED'
			}

		case 'CONNECTED':
			return {
				...state,
				options: action.payload,
				connState: action.type
			}

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

		case 'DEVICE_TOGGLE_FILTERS':
			return   {
				...state,
				useFilters: action.payload
			}

		case 'DEVICE_DATA_RECEIVED':
			return {
				...state,
				messages: state.messages.concat(action.payload).slice(-10000)
			}

		case 'DEVICE_CLEAR_MESSAGES':
			return {
				...state,
				messages: []
			}

		case 'LOGGING_UPDATE':
			return {
				...state,
				logname: action.payload
			}
		case 'LOGGING_ENABLE':
			return {
				...state,
				logging: action.payload
			}

		case 'DISCONNECT':
			return {
				...state,
				logging: false
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
						history: [],
						logging: false,
						logname: '',
						useFilters: true,
						options: null
					}
				]

		case 'DEVICE_LIST_ERROR':
			return []

		case 'DEVICE_MSG':
		case 'CONNECTED':
		case 'CONNECTING':
		case 'DISCONNECT':
		case 'DISCONNECTED':
		case 'DEVICE_REMOVE':
		case 'DEVICE_TOGGLE_FILTERS':
		case 'DEVICE_DATA_RECEIVED':
		case 'DEVICE_CLEAR_MESSAGES':
		case 'LOGGING_UPDATE':
		case 'LOGGING_ENABLE':
			return state.map(d => device(d, action))
		default:
			return state
	}
}
