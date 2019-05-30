import cn from 'classnames'
import Button from 'components/Button'
import React, { KeyboardEventHandler } from 'react'
import { Direction, SerialDevice } from 'types'

import './Messages.scss'

type Props = {
	device: SerialDevice
	onSend: (message: string) => void
	onClear: () => void
	onClose: () => void
}

type State = {
	message: string
	autoScroll: boolean
	historyIndex: number
	repeatInterval: number | null
	repeat: boolean
	showSent: boolean
}

export class Messages extends React.Component<Props, State> {
	state: State = {
		message: '',
		autoScroll: true,
		historyIndex: -1,
		repeatInterval: null,
		repeat: false,
		showSent: true
	}

	private messageInterval: ReturnType<Window['setInterval']> | null = null

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

	componentWillUnmount () {
		if (this.messageInterval !== null)
			clearInterval(this.messageInterval)
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
				const { repeatInterval } = this.state
				const endchar = '\n' // TODO: Add this to settings
				const message = e.currentTarget.value
				this.props.onSend(message + endchar)
				this.setState({ message: '', historyIndex: -1 })

				if (this.state.repeat && repeatInterval !== null && !isNaN(repeatInterval)) {
					if (this.messageInterval !== null)
						clearInterval(this.messageInterval)

					this.messageInterval = window.setInterval(
						() => this.props.onSend(message + endchar),
						repeatInterval
					)
				}
				break
			}
			case 38:
			case 40: {
				const { history } = this.props.device
				const historyIndex = e.keyCode === 38
					? Math.min(this.state.historyIndex + 1, history.length - 1)
					: Math.max(this.state.historyIndex - 1, -1)

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

	onRepeatClick (repeat: boolean) {
		if (!repeat && this.messageInterval !== null)
			clearInterval(this.messageInterval)

		this.setState({ repeat })
	}

	onIntervalChanged (interval: number) {
		const { history } = this.props.device
		if (this.state.repeat && this.messageInterval !== null && !isNaN(interval)) {
			clearInterval(this.messageInterval)

			this.messageInterval = window.setInterval(
				() => this.props.onSend(history[0]),
				interval
			)
		}
		this.setState({ repeatInterval: interval })
	}

	render () {
		const { device, onClear, onClose } = this.props
		const { message, autoScroll, repeatInterval, repeat, showSent } = this.state
		return (
			<div className={cn('session', device.connState.toLowerCase())}>
				<div className="properties">
					<span className="device-name">{device.comName}</span>
					<div className="field is-grouped">
						{repeat && <input
							className="input is-small"
							type="number"
							placeholder="Repeat interval"
							value={repeatInterval !== null ? repeatInterval : ''}
							onChange={e => this.onIntervalChanged(Number.parseInt(e.target.value, 10))}
						/>}
						<Button title="Repeat message" icon="sync" types={['small', 'primary']} solid={repeat} onClick={_ => this.onRepeatClick(!repeat)} />
						<Button title="Close" icon="times" types={['small', 'danger', 'outlined']} onClick={_ => { onClose(); onClear() }} />
						<Button title="Clear console" types={['small', 'info', 'outlined']} icon="eraser" onClick={onClear} />
						<Button title="Show sent messages" icon="paper-plane" types={['small', 'success']} solid={showSent} onClick={_ => this.setState({ showSent: !showSent})} />
						<Button
							title="Scroll to bottom"
							types={['small', 'warning']}
							solid={autoScroll}
							onClick={_ => this.setState({ autoScroll: !autoScroll })}
							icon="angle-double-down"
						/>
					</div>
				</div>
				<ul className="messages" ref={this.ulRef}>
					{device.messages.filter(msg => showSent || msg.direction !== Direction.Sent).map((msg, i) =>
						<li key={i} className={msg.direction === Direction.Received ? 'received' : 'sent'}>
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
