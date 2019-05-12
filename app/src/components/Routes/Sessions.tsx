import { Actions } from 'actions'
import { Messages } from 'components/Messages'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Sessions.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

class Home extends React.Component<Props> {
	render () {
		const { devices, sendMessage, clearMessages } = this.props
		return (
			<div className="sessions">
				{devices.filter(device => device.connState === 'CONNECTED' || device.messages.length > 0).map(device => (
					<Messages
						key={device.comName}
						device={device}
						onSend={msg => sendMessage(msg, device.comName)}
						onClear={() => clearMessages(null, device.comName)}
					/>
				))}
			</div>
		)
	}
}

const mapStateToProps = (state: State) => ({
	devices: state.devices
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	sendMessage: Actions.sendMessage,
	disconnect: Actions.disconnect,
	clearMessages: Actions.clearConsole
}

export default connect(mapStateToProps, dispatchToProps)(Home)
