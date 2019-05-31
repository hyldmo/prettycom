import cn from 'classnames'
import Button from 'components/Button'
import React, { KeyboardEventHandler } from 'react'
import { SerialDevice } from 'types'
import { Info } from './Info'
import Messages from './Messages'

import './Device.scss'

type Props = {
	device: SerialDevice
	filters: RegExp[]
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
	showSettings: boolean
	showFiltered: boolean
}

export class Device extends React.Component<Props, State> {
	state: State = {
		message: '',
		autoScroll: true,
		historyIndex: -1,
		repeatInterval: null,
		repeat: false,
		showSent: true,
		showSettings: false,
		showFiltered: false
	}

	private messageInterval: ReturnType<Window['setInterval']> | null = null
	private inputRef = React.createRef<HTMLInputElement>()

	componentWillUnmount () {
		if (this.messageInterval !== null)
			clearInterval(this.messageInterval)
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
		const { device, onClear, onClose, filters } = this.props
		const { message, autoScroll, repeatInterval, repeat, showSent, showSettings, showFiltered } = this.state
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
						<Button
							title="Repeat message"
							icon="sync"
							types={['small', 'primary']}
							solid={repeat}
							onClick={_ => this.onRepeatClick(!repeat)}
						/>
						<Button
							title={`${showFiltered ? 'Hide' : 'Show'} filtered messages`}
							icon={showFiltered ? 'eye' : 'eye-slash'}
							types={['small', 'warning']}
							solid={showFiltered}
							onClick={_ => this.setState({ showFiltered: !showFiltered })}
						/>
						<Button
							title="Clear console"
							types={['small', 'info', 'outlined']}
							icon="eraser"
							onClick={onClear}
						/>
						<Button
							title={`${showSent ? 'Hide' : 'Show'} sent messages`}
							icon="paper-plane"
							types={['small', 'success']}
							solid={showSent}
							onClick={_ => this.setState({ showSent: !showSent })}
						/>
						<Button
							title="Scroll to bottom"
							icon="angle-double-down"
							types={['small', 'warning']}
							solid={autoScroll}
							onClick={_ => this.setState({ autoScroll: !autoScroll })}
						/>
						<Button
							title="Info"
							icon="info-circle"
							types={['small', 'link']}
							solid={showSettings}
							onClick={_ => this.setState({ showSettings: !showSettings })}
						/>
						<Button
							title="Close"
							icon="times"
							types={['small', 'danger', 'outlined']}
							onClick={_ => { onClose(); onClear() }}
						/>
					</div>
				</div>
				{!showSettings ? (<>
					<Messages device={device} filters={showFiltered ? [] : filters} showSent={showSent} autoScroll={autoScroll} />
					<input
						type="text"
						className="chatbox"
						ref={this.inputRef}
						value={message}
						disabled={device.connState !== 'CONNECTED'}
						onChange={e => this.setState({ message: e.target.value, historyIndex: -1 })}
						onKeyUp={this.onKey}
					/>
				</>) : (
						<Info device={device} />
					)}

			</div>
		)
	}
}
