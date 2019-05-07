import React, { KeyboardEventHandler } from 'react'
import { SerialDevice } from 'types'

import './Messages.scss'

type Props = {
	device: SerialDevice
	onSend: (message: string) => void
}

type State = {
	message: string
}

export class Messages extends React.Component<Props, State> {
	state = {
		message: ''
	}

	private ref = React.createRef<HTMLUListElement>()

	componentDidUpdate (prevProps: Props) {
		const elem = this.ref.current
		if (elem && prevProps.device.messages.length !== this.props.device.messages.length) {
			elem.scrollTop = elem.scrollHeight
		}
	}

	onKey: KeyboardEventHandler<HTMLInputElement> = e => {
		if (e.keyCode === 13) {
			const endchar = '\n' // TODO: Add this to settings
			this.props.onSend(e.currentTarget.value + endchar)
			this.setState({ message: '' })
		}
	}

	render () {
		const { device } = this.props
		const { message } = this.state
		return (
			<div className="session">
				<div>{device.comName}</div>
				<ul className="messages" ref={this.ref}>
					{device.messages.slice(-500).map((msg, i) =>
						<li key={i}>
							<span className="timestamp">[{msg.timestamp.toLocaleTimeString()}]:</span>
							<span className="content">{msg.content}</span>
						</li>
					)}
				</ul>
				<input
					type="text"
					value={message}
					disabled={!device.connected}
					onChange={e => this.setState({ message: e.target.value })}
					onKeyUp={this.onKey}
				/>
			</div>
		)
	}
}
