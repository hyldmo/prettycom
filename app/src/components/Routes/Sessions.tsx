import { Actions } from 'actions'
import { Device } from 'components/Device'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Sessions.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Sessions: React.FunctionComponent<Props> = ({ devices, settings, sendMessage, clearMessages, disconnect }) => {
	const activeDevices = devices.filter(device => device.connState === 'CONNECTED' || device.messages.length > 0)
	return (
		<div className="sessions">
			{activeDevices.length === 0 ? (
				<h2>No devices connected.</h2>
			) :
			(activeDevices.map(device => (
				<Device
					key={device.comName}
					device={device}
					filters={settings.filters}
					messageLimit={settings.messageLimit}
					onSend={msg => sendMessage(msg, device.comName)}
					onClear={() => clearMessages(null, device.comName)}
					onClose={() => disconnect(null, device.comName)}
				/>
			)))}
		</div>
	)
}

const mapStateToProps = (state: State) => ({
	devices: state.devices,
	settings: state.settings
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	sendMessage: Actions.sendMessage,
	disconnect: Actions.disconnect,
	clearMessages: Actions.clearConsole
}

export default connect(mapStateToProps, dispatchToProps)(Sessions)
