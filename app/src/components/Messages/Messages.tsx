import cn from 'classnames'
import React, { KeyboardEventHandler } from 'react'
import { SerialDevice } from 'types'

import './Messages.scss'

type Props = {
	device: SerialDevice
	onSend: (message: string) => void
	onClear: () => void
}

type State = {
	message: string
	autoScroll: boolean;
	historyIndex: number
}

export class Messages extends React.Component<Props, State> {
	state = {
		message: '',
		autoScroll: true,
		historyIndex: -1
	}

	private ulRef = React.createRef<HTMLUListElement>()
	private inputRef = React.createRef<HTMLInputElement>()

	componentDidUpdate (prevProps: Props, prevState: State) {
		const { autoScroll } = this.state
		const messagesChanged = prevProps.device.messages.length !== this.props.device.messages.length
		if (autoScroll && (!prevState.autoScroll || messagesChanged)) {
			const elem = this.ulRef.current
			if (elem) {
				elem.scrollTop = elem.scrollHeight
			}
		}
	}

	scrollBottom () {
		const elem = this.ulRef.current
		if (elem) {
			elem.scrollTop = elem.scrollHeight
		}
	}

	onKey: KeyboardEventHandler<HTMLInputElement> = e => {
		switch (e.keyCode) {
			case 13: {
				const endchar = '\n' // TODO: Add this to settings
				const message = e.currentTarget.value
				this.props.onSend(message + endchar)
				this.setState({ message: '', historyIndex: -1 })
				break
			}
			case 38:
			case 40: {
				const { history } = this.props.device
				const historyIndex = e.keyCode === 38
					? Math.min(this.state.historyIndex + 1, history.length - 1)
					: Math.max(this.state.historyIndex - 1, -1)

				console.log(history[historyIndex], historyIndex)

				const message = history[historyIndex] || ''
				this.setState({ historyIndex, message }, () => {
					const input = this.inputRef.current
					if (input && input.setSelectionRange) {
						input.focus()
						input.setSelectionRange(message.length, message.length)
					}
				})
				break
			}
		}
	}

	render () {
		const { device, onClear } = this.props
		const { message, autoScroll } = this.state
		return (
			<div className="session">
				<div className="properties">
					<span>{device.comName}</span>
					<div className="field is-grouped">
						<button className="button is-small is-danger" title="Clear console" onClick={onClear}>
							<span className="icon"><i className="fas fa-eraser" /></span>
						</button>
						<button
							className={cn('button', 'is-small', 'is-warning', { 'is-inverted': !autoScroll, 'is-outlined': autoScroll })}
							title="Scroll to bottom"
							onClick={_ => this.setState({ autoScroll: !autoScroll })}
						>
							<span className="icon"><i className="fas fa-angle-double-down" /></span>
						</button>
					</div>
				</div>
				<ul className="messages" ref={this.ulRef}>
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
					ref={this.inputRef}
					value={message}
					disabled={device.connState !== 'CONNECTED'}
					onChange={e => this.setState({ message: e.target.value, historyIndex: -1 })}
					onKeyUp={this.onKey}
				/>
			</div>
		)
	}
}
