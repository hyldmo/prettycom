import { Action } from 'actions'

export type Settings = {
	filters: RegExp[]
	hideUnknown: boolean
	messageLimit: number
}

const intialState: Settings = {
	filters: [],
	hideUnknown: true,
	messageLimit: 1000
}

export default function (state: Settings = intialState, action: Action) {
	switch (action.type) {
		case 'SAVE_LOADED':
			return action.payload

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

		default:
			return state
	}
}
