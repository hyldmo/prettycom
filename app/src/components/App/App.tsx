import { NotFound, Sessions, Settings } from 'components/Routes'
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
				<Route exact path="/" component={Sessions} />
				<Route exact path="/settings" component={Settings} />
				<Route component={NotFound}/>
			</Switch>
		</main>
	</>
)

export default hot(module)(App)
