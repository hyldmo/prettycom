import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import devices from './devices'
import version from './version'

const reducers = combineReducers({
	routing,
	devices,
	version
})

export default reducers
