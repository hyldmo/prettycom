import { Actions } from 'actions'
import Button from 'components/Button'
import { push } from 'connected-react-router'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { SerialDevice, State } from 'types'
import { selectHost } from 'utils'
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

const canConnect = (d: SerialDevice) => d.available && d.connState == 'DISCONNECTED'

const Connect: React.FunctionComponent<Props> = ({ devices, settings, connectSerial, setServer }) => {
	const [selected, setDevice] = useState(devices[0]?.path)
	const [baud, setBaud] = useState('9600')
	const [customBaud, setCustomBaud] = useState<string | null>(null)

	const selectedDevice = devices.find(dev => dev.path === selected)
	return (
		<div className="connect">
			<div className="field is-horizontal">
				<div className="field-label">
					<label className="label">Server</label>
				</div>
				<div className="field-body">
					<div className="field has-addons">
						<div className="control">
							<input
								className="input"
								type="text"
								placeholder={selectHost(settings)}
								value={settings.host}
								onChange={e => setServer(e.target.value)}
							/>
						</div>
						<div className="control">
							<Button
								title="Clear console"
								types={['info']}
								icon="times"
								onClick={() => setServer('')}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="field is-horizontal">
				<div className="field-label">
					<label className="label">Select COM Device(s)</label>
				</div>
				<div className="field-body">
					<div className="control">
						<div className="select">
							<select value={devices.length > 0 ? selected : 'none'} onChange={e => setDevice(e.target.value)}>
								{devices.length > 0 ? (
									devices
										.filter(device => !settings.hideUnknown || !device.path?.includes('ttyS'))
										.sort((a, b) => Number(canConnect(b)) - Number(canConnect(a)))
										.map(device => (
											<option key={device.path}
												value={device.path}
												disabled={!canConnect(device)}
												title={device.available ? 'Arleady connected' : 'Device unavailable'}
											>
												({device.path}) {device.manufacturer} {device.productId}
											</option>
										))
								) : (
									<option disabled value="none">No devices found.</option>
								)}
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className="field is-horizontal">
				<div className="field-label">
					<label className="label">Choose baud rate</label>
				</div>
				<div className="field-body">
					<div className="field is-grouped">
						<div className="control">
							<div className="select">
								<select
									placeholder="Enter baud rate"
									value={baud}
									onChange={e => setBaud(e.target.value)}
								>
									{['115200', '57600', '38400', '19200', '9600', '4800', '2400', '1200', 'Custom'].map(opt => (
										<option key={opt}>{opt}</option>
									))}
								</select>
							</div>
						</div>
						{baud === 'Custom' && (
							<div className="control">
								<input
									className="input"
									type="number"
									placeholder="Enter baud rate"
									value={customBaud || ''}
									onChange={e => setCustomBaud(e.target.value)}
								/>
							</div>
						)}
					</div>

				</div>
			</div>
			<div className="field is-horizontal">
				<div className="field-label" />
				<div className="field-body">
					<Button
						types={['small', 'success']}
						disabled={!selected || (selectedDevice && selectedDevice.connState !== 'DISCONNECTED')}
						onClick={() => connectSerial({ baud: Number.parseInt(customBaud || baud, 10), device: selected, url: selectHost(settings) })}>
						Connect{getConnectedText(selectedDevice)}
					</Button>
				</div>
			</div>
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
	setServer: Actions.setServer,
	push
}

export default connect(mapStateToProps, dispatchToProps)(Connect)
