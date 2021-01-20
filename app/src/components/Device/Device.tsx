import cn from 'classnames'
import Button from 'components/Button'
import React, { KeyboardEventHandler } from 'react'
import { SerialDevice } from 'types'
import { Info } from './Info'
import Messages from './Messages'
import { Commands } from './Commands'

import './Device.scss'

type Props = {
	name: string
	device: SerialDevice
	filters: RegExp[]
	messageLimit: number
	onSend: (message: string) => void
	onClear: () => void
	onClose: () => void
	onToggleFilters: (enable: boolean) => void
	onTitleClick: () => void
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
	showCommandFile: boolean
	commandFile: string[] | null
	commandRunning: boolean
}

export class Device extends React.PureComponent<Props, State> {
	state: State = {
		message: '',
		autoScroll: true,
		historyIndex: -1,
		repeatInterval: null,
		repeat: false,
		showSent: true,
		showSettings: false,
		showFiltered: false,
		showCommandFile: false,
		commandFile: null,
		commandRunning: false
	}

	private messageInterval: ReturnType<Window['setInterval']> | null = null
	private inputRef = React.createRef<HTMLInputElement>()
	private n = 0

	componentWillUnmount () {
		if (this.messageInterval !== null)
			clearInterval(this.messageInterval)
	}

	evalMessage (msg: string): string {
		const endchar = '\n' // TODO: Add this to settings
		const message =  this.state.repeat
			? msg.replace('{n}', (this.n++).toString(16))
			: msg
		return message + endchar
	}

	onKey: KeyboardEventHandler<HTMLInputElement> = e => {
		switch (e.keyCode) {
			case 13: {
				const { repeat, repeatInterval } = this.state
				const message = e.currentTarget.value
				this.props.onSend(this.evalMessage(message))
				this.setState({ message: '', historyIndex: -1 })

				if (repeat && repeatInterval !== null && !isNaN(repeatInterval)) {
					if (this.messageInterval !== null)
						this.clearInterval()

					this.messageInterval = window.setInterval(
						() => this.props.onSend(this.evalMessage(message)),
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

	clearInterval () {
		if (this.messageInterval !== null) {
			clearInterval(this.messageInterval)
		}
		this.n = 0
	}

	onRepeatClick (repeat: boolean) {
		if (!repeat && this.messageInterval !== null)
			this.clearInterval()

		this.setState({ repeat })
	}

	onIntervalChanged (interval: number) {
		const { history } = this.props.device
		if (this.state.repeat && this.messageInterval !== null && !isNaN(interval)) {
			this.clearInterval()

			this.messageInterval = window.setInterval(
				() => this.props.onSend(history[0]),
				interval
			)
		}
		this.setState({ repeatInterval: isNaN(interval) ? null : interval })
	}

	onCommandOpenFile = async () => {
		const files = await window.ElectronDialog.showOpenDialog({ properties: ['openFile'] })
		const filename = files.filePaths.pop()
		if (filename) {
			const file = await window.FSreadFile(filename, 'utf-8')
			const lines = file.replace(/\r/g, '').split('\n').filter(line => line.length)
			this.setState({ commandFile: lines }, () => console.log(this.state))
		}
	}

	render () {
		const { name, device, onTitleClick, onClear, onClose, onToggleFilters, filters, messageLimit } = this.props
		const { message, autoScroll, repeatInterval, repeat, showSent, showSettings, commandFile, showCommandFile, commandRunning } = this.state
		const useFilters = device.useFilters

		return (
			<div className={cn('session', device.connState.toLowerCase())}>
				<div className="properties">
					<span className="device-name">{name ? `${name} (${device.path})` : device.path}</span>
					<div className="field is-grouped">
						{repeat && <input
							className="input is-small"
							type="number"
							placeholder="Repeat interval"
							value={repeatInterval !== null ? repeatInterval : ''}
							onChange={e => this.onIntervalChanged(Number.parseInt(e.target.value, 10))}
						/>}
						{commandFile !== null && <Button
							title="Run script"
							icon="play"
							solid={commandRunning}
							types={['small', 'primary']}
							onClick={() => this.setState({ commandRunning: !commandRunning })}
							onMouseEnter={() => this.setState({ showCommandFile: true })}
							onMouseLeave={() => this.setState({ showCommandFile: false })}
						/>}
						<Button
							title="Load command file"
							icon="terminal"
							solid={commandFile !== null}
							types={['small', 'secondary']}
							onClick={this.onCommandOpenFile}
							onMouseEnter={() => this.setState({ showCommandFile: true })}
							onMouseLeave={() => this.setState({ showCommandFile: false })}
						/>
						<Button
							title="Repeat last sent message"
							icon="sync"
							types={['small', 'primary']}
							solid={repeat}
							onClick={() => this.onRepeatClick(!repeat)}
						/>
						<Button
							title={`${useFilters ? 'Show' : 'Hide'} filtered messages`}
							icon={useFilters ? 'eye-slash' : 'eye'}
							types={['small', 'warning']}
							solid={!useFilters}
							onClick={() => onToggleFilters(!useFilters)}
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
							onClick={() => this.setState({ showSent: !showSent })}
						/>
						<Button
							title="Automatically scroll to bottom"
							icon="angle-double-down"
							types={['small', 'warning']}
							solid={autoScroll}
							onClick={() => this.setState({ autoScroll: !autoScroll })}
						/>
						<Button
							title="Info"
							icon="info-circle"
							types={['small', 'link']}
							solid={showSettings}
							onClick={() => this.setState({ showSettings: !showSettings })}
						/>
						<Button
							title="Reconnect"
							icon="redo"
							types={['small', 'warning', 'outlined']}
							onClick={onTitleClick}
						/>
						<Button
							title="Close"
							icon="times"
							types={['small', 'danger', 'outlined']}
							onClick={() => { onClose(); onClear() }}
						/>
					</div>
				</div>
				{commandFile && (
					<div className="command__wrapper">
						<Commands commands={commandFile} active={commandRunning} visible={commandRunning || showCommandFile}
							onFinished={() => this.setState({ commandRunning: false })}
							onSend={msg => this.props.onSend(msg)}
						/>
					</div>
				)}
				{!showSettings ? (<>
					<Messages device={device} filters={useFilters ? filters : []} showSent={showSent} autoScroll={autoScroll} messageLimit={messageLimit} />
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
