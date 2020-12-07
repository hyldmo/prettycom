import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'
import devices from './devices'
import connection from './connection'
import settings from './settings'

const reducers = (history: History) => combineReducers({
	router: connectRouter(history),
	connection,
	devices,
	settings
})

export type State = ReturnType<ReturnType<typeof reducers>>

export default reducers
