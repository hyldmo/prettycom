import { Predicate } from '@redux-saga/types'
import { Action, Actions } from 'actions'
import { Settings } from 'reducers/settings'
import { call, put, select, takeLatest  } from 'redux-saga/effects'
import { State } from 'types'
import { sleep } from 'utils'

const SAVE_KEY = 'prettycom'

const predicate: Predicate<Action> = (a: Action) => a.type.startsWith('SETTINGS_')

export default function* () {
	yield takeLatest<Action>(predicate as any, save)
	yield takeLatest<Action>('SAVE_LOAD', load)
}

type SerializedSettings = Omit<Settings, 'filters'> & {
	filters: string[]
}

function* save () {
	yield call(sleep, 100)
	const settings: Settings = yield select<(s: State) => unknown>(s => s.settings)
	const saveSettings: SerializedSettings = {
		...settings,
		filters: settings.filters.map(f => f.source)
	}
	localStorage.setItem(SAVE_KEY, JSON.stringify(saveSettings))
}

function* load () {
	const saveState = localStorage.getItem(SAVE_KEY)
	if (saveState) {
		const settings: SerializedSettings = JSON.parse(saveState)
		const parsedSettings = {
			...settings,
			filters: settings.filters.map(f => new RegExp(f))
		}
		yield put(Actions.saveLoaded(parsedSettings))
	}
}
