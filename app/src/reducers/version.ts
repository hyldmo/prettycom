import { Action } from 'actions'

export default function (state: string = '', action: Action) {
	switch (action.type) {
		case 'VERSION_FETCHED':
			return action.payload
		default:
			return state
	}
}
