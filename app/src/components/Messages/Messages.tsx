import React, { KeyboardEventHandler } from 'react'
import { SerialDevice } from 'types'

import './Messages.scss'

type Props = {
	device: SerialDevice
	onSend: (message: string) => void
}

type State = {
	message: string
	autoScroll: boolean;
}

export class Messages extends React.Component<Props, State> {
	state = {
		message: '',
		autoScroll: true
	}

	private ref = React.createRef<HTMLUListElement>()

	componentDidUpdate (prevProps: Props, prevState: State) {
		const { autoScroll } = this.state
		const messagesChanged = prevProps.device.messages.length !== this.props.device.messages.length
		if (autoScroll && (!prevState.autoScroll || messagesChanged)) {
			const elem = this.ref.current
			if (elem) {
				elem.scrollTop = elem.scrollHeight
			}
		}
	}

	scrollBottom () {
		const elem = this.ref.current
		if (elem) {
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
		const { message, autoScroll: scrollToBottom } = this.state
		return (
			<div className="session">
				<div className="properties">
					<span>{device.comName}</span>
					<label>
						<input type="checkbox" onChange={e => this.setState({ autoScroll: e.target.checked })} checked={scrollToBottom} />
						<span>Autoscroll</span>
					</label>
				</div>
				<ul className="messages" ref={this.ref}>
					{device.messages.map((msg, i) =>
						<li key={i}>
							<span className="timestamp">[{msg.timestamp.toLocaleTimeString()}]:</span>
							<span className="content">{msg.content}</span>
						</li>
					)}
				</ul>
				<input
					type="text"
					className="chatbox"
					value={message}
					disabled={!device.connected}
					onChange={e => this.setState({ message: e.target.value })}
					onKeyUp={this.onKey}
				/>
			</div>
		)
	}
}
