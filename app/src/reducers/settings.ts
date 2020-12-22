import { Action } from 'actions'
import { DEFAULT_PORT } from 'consts'

export type Settings = {
	filters: RegExp[]
	hideUnknown: boolean
	messageLimit: number
	host: string
	remotePort: null | string
	logDefault: boolean
	deviceNames: Record<string, string>
}

export const initialState: Readonly<Settings> = {
	filters: [],
	hideUnknown: true,
	messageLimit: 5000,
	host: `localhost:${DEFAULT_PORT}`,
	remotePort: null,
	logDefault: false,
	deviceNames: {}
}

export default function (state: Settings = initialState, action: Action) {
	switch (action.type) {
		case 'SAVE_LOADED':
			return {
				...state,
				...action.payload
			}

		case 'SETTINGS_FILTER_ADD':
			return {
				...state,
				filters: [...state.filters, action.payload]
			}

		case 'SETTINGS_FILTER_REMOVE':
			return {
				...state,
				filters: state.filters.filter(filter => filter.source !== action.payload.source)
			}

		case 'SETTINGS_HIDE_UNKNOWN':
			return {
				...state,
				hideUnknown: action.payload
			}

		case 'SETTINGS_MESSSAGE_LIMIT_CHANGED':
			return {
				...state,
				messageLimit: action.payload
			}

		case 'SETTINGS_DEVICE_UPDATE_NAME':
			return {
				...state,
				deviceNames: {
					...state.deviceNames,
					[action.meta]: action.payload
				}
			}

		case 'SETTINGS_REMOTE_SET':
			return {
				...state,
				remotePort: action.payload
			}

		case 'SETTINGS_SERVER_SET':
			return {
				...state,
				host: action.payload
			}

		case 'SETTINGS_LOG_DEFAULT':
			return {
				...state,
				logDefault: action.payload
			}

		default:
			return state
	}
}
