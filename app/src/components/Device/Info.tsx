import { Actions } from 'actions'
import React from 'react'
import { useDispatch } from 'react-redux'
import { SerialDevice } from 'types'

import './Info.scss'

type Props = {
	device: SerialDevice
}

export const Info: React.FunctionComponent<Props> = ({ device }) => {
	const dispatch = useDispatch()

	return (
		<div className="session-settings">
			<ul className="info">
				{Object.entries(device).filter(([, value]) => typeof value === 'string').map(([key, value]) => (
					<li key={key}>
						<span>{key}:&nbsp;</span>
						<span>{value as any}</span>
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
					<input type="text" value={device.logname} onChange={e => dispatch(Actions.updateLogName(e.target.value, device.path))}/>
				</fieldset>
			</div>
		</div>
	)
}

export default Info
