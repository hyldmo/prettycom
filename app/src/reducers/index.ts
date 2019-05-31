import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import devices from './devices'
import settings from './settings'

const reducers = combineReducers({
	routing,
	devices,
	settings
})

export default reducers
