import { createAction } from 'utils'

export default {
	saveLoaded: createAction<'SAVE_LOADED', any>('SAVE_LOADED'),
	loadSave: createAction<'SAVE_LOAD'>('SAVE_LOAD')
}
