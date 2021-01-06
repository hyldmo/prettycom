import { Actions } from 'actions'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SerialDevice, State } from 'types'
import { logName } from 'utils'

import './Info.scss'

type Props = {
	device: SerialDevice
}

export const Info: React.FunctionComponent<Props> = ({ device }) => {
	const dispatch = useDispatch()
	const deviceNames = useSelector((state: State) => state.settings.deviceNames)
	const name = deviceNames[device.path] || ''

	return (
		<div className="session-settings">
			<div className="field">
				<div className="field-label">Name</div>
				<div className="field-body">
					<input type="text" className="input" value={name} onChange={e => dispatch(Actions.updateName(e.target.value, device.path))} />
				</div>
			</div>
			<ul className="info">
				{Object
					.entries(device)
					.filter(([key]) => !['name', 'messages'].includes(key))
					.map(([key, value]) => typeof value == 'object' ? [key, Object.entries(value).map(childEntry => [`${key}.${childEntry[0]}`, childEntry[1]])] : [key, value])
					.reduce((a, b) =>  Array.isArray(b[1]) ? [...a, ...b[1]] : [...a, b], []) // Flatten array
					.map(([key, value]) => (
						<li key={key.toString()}>
							<span>{key}:&nbsp;</span>
							<span>{value.toString()}</span>
						</li>
					))}
			</ul>

			<div className="logging">
				<h2>Logging</h2>
				<label>
					<span>Log to file: </span>
					<input type="checkbox" checked={device.logging} onChange={e => dispatch(Actions.enableLog(e.target.checked, device.path))} />
				</label>
				<fieldset>
					<label>Filename: </label>
					<input type="text"
						placeholder={logName(device, deviceNames)}
						value={device.logname}
						onChange={e => dispatch(Actions.updateLogName(e.target.value, device.path))}
					/>
				</fieldset>
			</div>
		</div>
	)
}

export default Info
