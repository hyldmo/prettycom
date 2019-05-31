import { Settings } from 'reducers/settings'
import { createAction } from 'utils'

export default {
	saveLoaded: createAction<'SAVE_LOADED', Settings>('SAVE_LOADED'),
	loadSave: createAction<'SAVE_LOAD'>('SAVE_LOAD'),

	// If settting should be autosaved, set type to SETTINGS_<name>
	addFilter: createAction<'SETTINGS_FILTER_ADD', RegExp>('SETTINGS_FILTER_ADD'),
	removeFilter: createAction<'SETTINGS_FILTER_REMOVE', RegExp>('SETTINGS_FILTER_REMOVE'),
	setHideUnknown: createAction<'SETTINGS_HIDE_UNKNOWN', boolean>('SETTINGS_HIDE_UNKNOWN')
}
