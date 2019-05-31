import { Actions } from 'actions'
import { Device } from 'components/Device'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Sessions.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

class Home extends React.Component<Props> {
	render () {
		const { devices, filters, sendMessage, clearMessages, disconnect } = this.props
		return (
			<div className="sessions">
				{devices.filter(device => device.connState === 'CONNECTED' || device.messages.length > 0).map(device => (
					<Device
						key={device.comName}
						device={device}
						filters={filters}
						onSend={msg => sendMessage(msg, device.comName)}
						onClear={() => clearMessages(null, device.comName)}
						onClose={() => disconnect(null, device.comName)}
					/>
				))}
			</div>
		)
	}
}

const mapStateToProps = (state: State) => ({
	devices: state.devices,
	filters: state.settings.filters
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	sendMessage: Actions.sendMessage,
	disconnect: Actions.disconnect,
	clearMessages: Actions.clearConsole
}

export default connect(mapStateToProps, dispatchToProps)(Home)
