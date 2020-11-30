import { Action as ReduxAction } from 'redux'
import { GetMetaActions } from './actionCreator'
import ConnectActions from './connect'
import SettingsActions from './settings'
import VersionActions from './version'

export const Actions = {
	...SettingsActions,
	...VersionActions,
	...ConnectActions
}

export type ActionCreator = typeof Actions[keyof typeof Actions]
type A = ReturnType<ActionCreator>
export type Action<TKey extends ActionTypes = any, TAction extends A = A> = TAction extends ReduxAction<TKey> ? TAction : never
export type MetaAction = GetMetaActions<Action>
export type ActionTypes = Action['type']

export * from './actionCreator'

