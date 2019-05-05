import { Actions } from 'actions'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { State } from 'types'

import './navbar.less'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Navbar: React.StatelessComponent<Props> = ({ devices, connectSerial, disconnect }) => {
	const [selected, setDevice] = useState('')
	const [baud, setBaud] = useState(2400)

	return (
		<header>
			<nav>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li>
						<select className="devices" value={selected} onChange={e => setDevice(e.target.value)}>
							<option value="">Select COM</option>
							{devices.map(device => (
								<option key={device.comName} value={device.comName}>{device.comName}</option>
							))}
						</select>
					</li>
					<li><input type="number" placeholder="Enter baud rate" value={baud} onChange={e => setBaud(Number.parseInt(e.target.value, 10))} /></li>
					<li><button disabled={!selected} onClick={_ => connectSerial({ baud, device: selected })}>Connect</button></li>
					<li><button disabled={!selected} onClick={_ => disconnect(selected)}>Disconnect</button></li>
				</ul>
			</nav>
		</header >
	)
}

const mapStateToProps = (state: State) => ({
	devices: state.devices
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	disconnect: Actions.disconnect
}

export default connect(mapStateToProps, dispatchToProps)(Navbar)
