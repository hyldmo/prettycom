import { Actions } from 'actions'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './home.less'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Home: React.StatelessComponent<Props> = ({ devices }) => {
	return (
		<div className="sessions">
			{devices.filter(device => device.connected).map(device => (
				<ul key={device.comName} className="messages">
					{device.messages.map(msg =>
						<li key={msg.timestamp.toString()}>[{msg.timestamp.toLocaleTimeString()}] {msg.content}</li>
					)}
				</ul>
			))}
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
