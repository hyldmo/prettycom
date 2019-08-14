import Button from 'components/Button'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { State } from 'types'
import './navbar.scss'

type Props = ReturnType<typeof mapStateToProps>

const Navbar: React.FunctionComponent<Props> = ({ location }) => {
	const isHome = location.pathname === '/'

	return (
		<header>
			<nav>
				<ul>
					<li>
						<Button
							element={<Link to="/connect"/>}
							types={['small', 'success']}>
							Connect
						</Button>
					</li>
					<li className="settings">
						<Link to={!isHome ? '/' : 'settings'} className="button is-small is-link">
							{!isHome ? 'Close' : 'Settings'}
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

const mapStateToProps = (state: State) => ({
	location: state.router.location
})

export default connect(mapStateToProps)(Navbar)
