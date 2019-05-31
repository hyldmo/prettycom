import React from 'react'
import { Settings } from 'reducers/settings'
import { Direction, SerialDevice } from 'types'

type Props = {
	device: SerialDevice
	filters: Settings['filters']
	showSent?: boolean
}

const Messages = React.forwardRef<HTMLUListElement, Props>(({ device, filters, showSent }, ref) => (
	<ul className="messages" ref={ref}>
		{device.messages
			.filter(msg =>
				(showSent || msg.direction !== Direction.Sent) &&
				!filters.some(filter => filter.test(msg.content))
			)
			.map((msg, i) =>
				<li key={i} className={msg.direction === Direction.Received ? 'received' : 'sent'}>
					<span className="timestamp">[{msg.timestamp.toLocaleTimeString()}]:</span>
					<span className="content">{msg.content}</span>
				</li>
			)
		}
	</ul>
))

export default Messages
