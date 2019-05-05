import ConnectActions from './connect'
import TrackerActions from './tracker'
import VersionActions from './version'

export const Actions = {
	...TrackerActions,
	...VersionActions,
	...ConnectActions
}

export type Action = typeof Actions[keyof typeof Actions]
export * from './actionCreator'
