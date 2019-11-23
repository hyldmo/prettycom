import React from 'react'
import { SerialDevice } from 'types'

import './Info.scss'

type Props = {
	device: SerialDevice
}

export const Info: React.FunctionComponent<Props> = ({ device }) => (
	<div className="session-settings">
		<ul className="info">
			{Object.entries(device).filter(([, value]) => typeof value === 'string').map(([key, value]) => (
				<li key={key}>
					<span>{key}:&nbsp;</span>
					<span>{value as any}</span>
				</li>
			))}
		</ul>
	</div>
)

export default Info
