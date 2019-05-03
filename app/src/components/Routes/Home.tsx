import { Actions } from 'actions'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Home: React.StatelessComponent<Props> = ({ devices, connectSerial, disconnect }) => {
	const [selected, setDevice] = useState('')

	return (
		<div>
			<h1>Hello world</h1>
			<select className="devices" value={selected} onChange={e => setDevice(e.target.value)}>
				<option value="">Please select a port</option>
				{devices.map(device => (
					<option key={device.comName} value={device.comName}>{device.comName}</option>
				))}
			</select>
			<button disabled={!selected} onClick={_ => connectSerial({ baud: 2400, device: selected })}>Connect</button>
			<button disabled={!selected} onClick={_ => disconnect(selected)}>Disconnect</button>
			<div className="sessions">
				{devices.filter(device => device.connected).map(device => (
					<div key={device.comName}>
						<ul>
							{device.messages.map(msg =>
								<li key={msg.timestamp.toString()}>[{msg.timestamp.toString()}] {msg.content}</li>
							)}
						</ul>
					</div>
				))}
			</div>
		</div>
	)
}

const mapStateToProps = (state: State) => ({
	devices: state.devices
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	disconnect: Actions.disconnect
}

export default connect(mapStateToProps, dispatchToProps)(Home)
