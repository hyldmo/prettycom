import { Connect, NotFound, Sessions, Settings } from 'components/Routes'
import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch } from 'react-router'
import Navbar from './Navbar'

import './App.scss'

const App: React.FunctionComponent = () => (
	<>
		<Navbar/>
		<main>
			<Switch>
				<Route exact path="/">
					<Sessions />
				</Route>
				<Route exact path="/connect">
					<Connect />
				</Route>
				<Route exact path="/settings">
					<Settings />
				</Route>
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</main>
	</>
)

export default hot(module)(App)
