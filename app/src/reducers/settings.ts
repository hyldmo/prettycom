import { Action } from 'actions'

export type Settings = {
	filters: RegExp[]
	hideUnknown: boolean
}

const intialState: Settings = {
	filters: [],
	hideUnknown: true
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

		default:
			return state
	}
}
