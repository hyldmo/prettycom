import { Actions } from 'actions'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Provider } from 'react-redux'
import RedBox from 'redbox-react'
import configureStore, { history } from '../../configureStore'
import App from './App'

const store = configureStore()
store.dispatch(Actions.loadSave())
store.dispatch(Actions.listDevices())

type State = {
	error: Error | null
}

class Root extends React.PureComponent<{}, State> {
	state: State = {
		error: null
	}

	componentWillReceiveProps () {
		this.setState({ error: null })
	}

	componentDidCatch (error: Error, info: React.ErrorInfo) {
		// tslint:disable-next-line:no-console
		console.warn(info)
		this.setState({ error })
	}

	render () {
		const { error } = this.state
		if (error && process.env.NODE_ENV !== 'test') {
			return <RedBox error={error} />
		}
		return (
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</Provider>
		)
	}
}

export default Root
