import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import devices from './devices'
import tracker from './tracker'
import version from './version'

const reducers = combineReducers({
	routing,
	devices,
	tracker,
	version
})

export default reducers
