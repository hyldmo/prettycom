import { Action, Actions } from 'actions'
import { END, eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import { Direction } from 'types'

const EOM = /[\0\r\n]/g // End Of Message

export function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	let buffer = ''

	while (true) {
		const msg: string = yield take(msgChannel)
		buffer = buffer.concat(msg)
		if (msg.match(EOM)) {
			const messages = buffer.split(EOM).filter(str => str.length > 0)
			const remainder = messages.length > 1 // Extract last part of transmission as it may not be finished yet
				? messages.pop() as string
				: ''

			for (const message of messages) {
				yield put(Actions.dataReceived({
					timestamp: new Date(),
					content: message,
					direction: Direction.Received
				}, device))
			}
			buffer = remainder
		}
	}
}

export function* watchUserSentMessages (socket: WebSocket, device: string) {
	while (true) {
		const { payload } = yield take((action: Action) => action.type === 'DEVICE_MSG' && action.meta === device)
		socket.send(payload)
	}
}

export function waitForOpen (socket: WebSocket) {
	return new Promise((resolve, reject) => {
		socket.addEventListener('open', resolve)
		socket.addEventListener('close', reject)
		socket.addEventListener('error', reject)
	})
}

export function socketChannel (socket: WebSocket) {
	return eventChannel(emitter => {
		const listeners = {
			message: (event: WebSocketEventMap['message']) => {
				emitter(event.data)
			},
			close: (event: WebSocketEventMap['close']) => {
				switch (event.code) {
					case 1000:
					case 1001:
						break

					default:
						emitter(new Error(`${event.code}: ${event.reason}`))
				}

				emitter(END)
			},
			error: (event: WebSocketEventMap['error']) => {
				console.error(event)
				emitter(event)
				emitter(END)
			}
		}
		Object.entries(listeners)
			.forEach(([key, value]) => socket.addEventListener(key, value as any))

		return () => {
			Object.entries(listeners).forEach(([key, value]) => socket.removeEventListener(key, value as any))
			if (socket.readyState === socket.OPEN)
				socket.close()

			// TODO: Figure out if event listeners needs to be removed
		}
	})
}
