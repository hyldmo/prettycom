import { Action } from 'actions'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { State } from 'types'
import rootReducer from './reducers'
import SagaManager from './sagas/SagaManager'

const __DEV__ = process.env.NODE_ENV === 'development'

const sagaMiddleware = createSagaMiddleware()

export const history = createHashHistory()
const middlewares = [sagaMiddleware, routerMiddleware(history)]

const logger = createLogger({
	predicate: (getState, action: Action) => !['DEVICE_ADD', 'DEVICE_DATA_RECEIVED'].includes(action.type)
})

if (__DEV__)
	middlewares.push(logger)

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore (initialState?: Partial<State>) {
	const store = createStore(
		rootReducer(history),
		initialState || {},
		composeEnhancers(
			applyMiddleware(...middlewares)
		)
	)

	// run sagas
	SagaManager.startSagas(sagaMiddleware)

	if (__DEV__ && module.hot) {
		// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
		module.hot.accept('./reducers', () =>
			store.replaceReducer(require('./reducers').default)
		)

		module.hot.accept('./sagas/SagaManager', () => {
			SagaManager.cancelSagas(store)
			require('./sagas/SagaManager').default.startSagas(sagaMiddleware)
		})
	}

	return store
}
