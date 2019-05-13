import { Actions } from 'actions'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { SerialDevice, State } from 'types'

import './navbar.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const getConnectedText = (device?: SerialDevice): string => {
	if (!device) return ''
	switch (device.connState) {
		case 'CONNECTING':
			return 'ing'
		case 'CONNECTED':
			return 'ed'
		default:
			return ''
	}
}

const Navbar: React.StatelessComponent<Props> = ({ location, devices, connectSerial, disconnect }) => {
	const [selected, setDevice] = useState('')
	const [baud, setBaud] = useState(38400)

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
								<option key={device.comName} value={device.comName}>
									({device.comName}) {device.manufacturer} {device.productId}
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
							disabled={!selected || (selectedDevice && selectedDevice.connState !== 'DISCONNECTED')}
							onClick={_ => connectSerial({ baud, device: selected })}>
							Connect{getConnectedText(selectedDevice)}
						</button>
					</li>
					<li>
						<button
							className="button is-small is-warning"
							disabled={!selected || (selectedDevice && selectedDevice.connState === 'DISCONNECTED')}
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
