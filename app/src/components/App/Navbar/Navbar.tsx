import { Actions } from 'actions'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link  } from 'react-router-dom'
import { State } from 'types'

import './navbar.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Navbar: React.StatelessComponent<Props> = ({ location, devices, connectSerial, disconnect }) => {
	const [selected, setDevice] = useState('')
	const [baud, setBaud] = useState(2400)

	const selectedDevice = devices.find(dev => dev.comName === selected)

	const isSettingsOpen = (location && location.pathname.includes('settings'))

	return (
		<header>
			<nav>
				<ul>
					<li>
						<select className="select is-small" value={selected} onChange={e => setDevice(e.target.value)}>
							<option value="">Select COM</option>
							{devices.map(device => (
								<option key={device.comName} value={device.comName} disabled={device.connected}>
									{device.comName}
								</option>
							))}
						</select>
					</li>
					<li>
						<input
							className="input is-small"
							type="number"
							placeholder="Enter baud rate"
							value={baud}
							onChange={e => setBaud(Number.parseInt(e.target.value, 10))}
						/>
					</li>
					<li>
						<button
							className="button is-small is-success"
							disabled={!selected || (selectedDevice && selectedDevice.connected)}
							onClick={_ => connectSerial({ baud, device: selected })}>
								Connect
						</button>
					</li>
					<li>
						<button
							className="button is-small is-warning"
							disabled={!selected || (selectedDevice && !selectedDevice.connected)}
							onClick={_ => disconnect(null, selected)}>
							Disconnect
						</button>
					</li>
					<li className="settings">
						<Link to={isSettingsOpen ? '/' : 'settings'} className="button is-small is-link">
							{isSettingsOpen ? 'Close' : 'Settings'}
						</Link>
					</li>
				</ul>
			</nav>
		</header >
	)
}

const mapStateToProps = (state: State) => ({
	location: state.routing.location,
	devices: state.devices
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	disconnect: Actions.disconnect
}

export default connect(mapStateToProps, dispatchToProps)(Navbar)
