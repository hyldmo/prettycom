import { Actions } from 'actions'
import { eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

export default function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	try {
		let msg = ''
		while (true) {
			const data = yield take(msgChannel)
			msg = msg.concat(data)
			if (['\0', '\r', '\n'].includes(data)) {
				yield put(Actions.dataReceived({
					timestamp: new Date(),
					content: msg
				}, device))
				msg = ''
			}
		}
	} finally {
		console.log(`Stopped watching messages from ${socket.url}`)
	}
}

export function* socketChannel (socket: WebSocket) {
	return eventChannel(emitter => {
		socket.onmessage = event => {
			emitter(event.data)
			// TODO: Handle non-irc message events
		}
		return socket.close
	})
}
