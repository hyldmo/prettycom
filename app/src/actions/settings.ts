import { Settings } from 'reducers/settings'
import { SerialDevice } from 'types'
import { actionCreator } from './actionCreator'

export default {
	saveLoaded: actionCreator<'SAVE_LOADED', Settings>('SAVE_LOADED'),
	loadSave: actionCreator<'SAVE_LOAD'>('SAVE_LOAD'),

	// If settting should be autosaved, set type to SETTINGS_<name>
	addFilter: actionCreator<'SETTINGS_FILTER_ADD', RegExp>('SETTINGS_FILTER_ADD'),
	removeFilter: actionCreator<'SETTINGS_FILTER_REMOVE', RegExp>('SETTINGS_FILTER_REMOVE'),
	setHideUnknown: actionCreator<'SETTINGS_HIDE_UNKNOWN', boolean>('SETTINGS_HIDE_UNKNOWN'),
	setMessageLimit: actionCreator<'SETTINGS_MESSSAGE_LIMIT_CHANGED', number>('SETTINGS_MESSSAGE_LIMIT_CHANGED'),

	updateLogName: actionCreator<'LOGGING_UPDATE', string, SerialDevice['path']>('LOGGING_UPDATE'),
	enableLog: actionCreator<'LOGGING_ENABLE', boolean, SerialDevice['path']>('LOGGING_ENABLE'),

	setServer: actionCreator<'SETTINGS_SERVER_SET', string>('SETTINGS_SERVER_SET'),

	setRemote: actionCreator<'SETTINGS_REMOTE_SET', Settings['remotePort']>('SETTINGS_REMOTE_SET'),

	setDefaultLog: actionCreator<'SETTINGS_LOG_DEFAULT', Settings['logDefault']>('SETTINGS_LOG_DEFAULT')
}
