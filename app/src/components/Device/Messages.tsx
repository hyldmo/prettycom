import React from 'react'
import { Settings } from 'reducers/settings'
import { Direction, SerialDevice } from 'types'

type Props = {
	device: SerialDevice
	filters: Settings['filters']
	showSent?: boolean
	autoScroll?: boolean
}

class Messages extends React.PureComponent<Props> {
	private ulRef = React.createRef<HTMLUListElement>()

	componentDidMount () {
		if (this.props.autoScroll)
			this.scrollBottom()
	}

	componentDidUpdate (prevProps: Props) {
		const { autoScroll } = this.props
		const messagesChanged = prevProps.device.messages.length !== this.props.device.messages.length
		if (autoScroll && (!prevProps.autoScroll || messagesChanged))
			this.scrollBottom()
	}

	scrollBottom () {
		const elem = this.ulRef.current
		if (elem) {
			elem.scrollTop = elem.scrollHeight
		}
	}

	render () {
		const { device, filters, showSent } = this.props
		return (
			<ul className="messages" ref={this.ulRef}>
				{device.messages
					.filter(msg =>
						(showSent || msg.direction !== Direction.Sent) &&
						(msg.direction === Direction.Sent || !filters.some(filter => filter.test(msg.content)))
					)
					.map((msg, i) =>
						<li key={i} className={msg.direction === Direction.Received ? 'received' : 'sent'}>
							<span className="timestamp">[{msg.timestamp.toLocaleTimeString('nb-NO')}]:</span>
							<span className="content">{msg.content}</span>
						</li>
					)
				}
			</ul>
		)
	}
}

export default Messages
