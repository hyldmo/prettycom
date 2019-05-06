import React from 'react'
import { SerialDevice } from 'types'

import './Messages.scss'

type Props = {
	device: SerialDevice
}

export class Messages extends React.Component<Props> {
	private ref = React.createRef<HTMLUListElement>()

	componentDidUpdate (prevProps: Props) {
		const elem = this.ref.current
		if (elem && prevProps.device.messages.length !== this.props.device.messages.length) {
			elem.scrollTop = elem.scrollHeight
		}
	}

	render () {
		const { device } = this.props
		return (
			<ul key={device.comName} className="messages" ref={this.ref}>
				{device.messages.map(msg =>
					<li key={msg.timestamp.toString()}>
						<span className="timestamp">[{msg.timestamp.toLocaleTimeString()}]:</span>
						<span className="content">{msg.content}</span>
					</li>
				)}
			</ul>
		)
	}
}
