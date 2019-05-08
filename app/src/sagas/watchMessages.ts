import { Action, Actions } from 'actions'
import { END, eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

export function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	let msg = ''

	while (true) {
		const data: string = yield take(msgChannel)
		msg = msg.concat(data)
		if (['\0', '\r', '\n'].some(c => data.includes(c))) {
			for (const message of msg.split('\n')) {
				if (message.length > 0)
					yield put(Actions.dataReceived({
						timestamp: new Date(),
						content: message
					}, device))
			}
			msg = ''
		}
	}
}

export function* watchUserSentMessages (socket: WebSocket, device: string) {
	while (true) {
		const { payload } = yield take<any>((action: Action) => {
			return action.type === 'DEVICE_MSG' && action.meta === device
		})
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

export function* socketChannel (socket: WebSocket) {
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
				emitter(new Error('Unkown error'))
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
