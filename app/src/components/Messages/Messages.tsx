import React from 'react'
import { SerialDevice } from 'types'

type Props = {
	device: SerialDevice
}

export class Messages extends React.Component<Props> {
	private ref = React.createRef<HTMLUListElement>()

	componentDidUpdate () {
		const elem = this.ref.current!
		elem.scrollTop = elem.scrollHeight
	}

	render () {
		const { device } = this.props
		return (
			<ul key={device.comName} className="messages" ref={this.ref}>
				{device.messages.map(msg =>
					<li key={msg.timestamp.toString()}>[{msg.timestamp.toLocaleTimeString()}] {msg.content}</li>
				)}
			</ul>
		)
	}
}
