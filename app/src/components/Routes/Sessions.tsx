import { Actions } from 'actions'
import { Device } from 'components/Device'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Sessions.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Sessions: React.FunctionComponent<Props> = ({ devices, settings, sendMessage, clearMessages, connectSerial, disconnect, toggleFilters }) => {
	const activeDevices = devices.filter(device => device.connState === 'CONNECTED' || device.messages.length > 0)
	return (
		<div className="sessions">
			{activeDevices.length === 0 ? (
				<h2>No devices connected.</h2>
			) :
			(activeDevices.map(device => (
				<Device
					key={device.path}
					name={settings.deviceNames[device.path]}
					device={device}
					filters={settings.filters}
					messageLimit={settings.messageLimit}
					onTitleClick={() => device.options && connectSerial(device.options)}
					onSend={msg => sendMessage(msg, device.path)}
					onClear={() => clearMessages(null, device.path)}
					onClose={() => disconnect(null, device.path)}
					onToggleFilters={enable => toggleFilters(enable, device.path)}
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
	clearMessages: Actions.clearConsole,
	toggleFilters: Actions.toggleFilters
}

export default connect(mapStateToProps, dispatchToProps)(Sessions)
