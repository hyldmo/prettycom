import { Actions } from 'actions'
import Button from 'components/Button'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { SerialDevice, State } from 'types'
import './Connect.scss'

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

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Connect: React.FunctionComponent<Props> = ({ devices, settings, connectSerial }) => {
	const [selected, setDevice] = useState('')
	const [baud, setBaud] = useState(38400)

	const selectedDevice = devices.find(dev => dev.comName === selected)

	return (
		<div className="connect">
			<select className="select is-small" value={selected} onChange={e => setDevice(e.target.value)}>
				<option value="">Select COM</option>
				{devices.filter(device => !settings.hideUnknown || !device.comName.includes('ttyS')).map(device => (
					<option key={device.comName} value={device.comName}>
						({device.comName}) {device.manufacturer} {device.productId}
					</option>
				))}
			</select>
			<input
				className="input is-small"
				type="number"
				placeholder="Enter baud rate"
				value={baud}
				onChange={e => setBaud(Number.parseInt(e.target.value, 10))}
			/>
			<Button
				types={['small', 'success']}
				disabled={!selected || (selectedDevice && selectedDevice.connState !== 'DISCONNECTED')}
				onClick={_ => connectSerial({ baud, device: selected })}>
				Connect{getConnectedText(selectedDevice)}
			</Button>
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

export default connect(mapStateToProps, dispatchToProps)(Connect)
