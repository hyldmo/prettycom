import ConnectActions from './connect'
import SettingsActions from './settings'
import VersionActions from './version'

export const Actions = {
	...SettingsActions,
	...VersionActions,
	...ConnectActions
}

export type Action = typeof Actions[keyof typeof Actions]
export * from './actionCreator'
