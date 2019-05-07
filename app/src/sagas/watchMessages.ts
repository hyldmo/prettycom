import { Action, Actions } from 'actions'
import { END, eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

export function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	try {
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
	} finally {
		console.log(`Stopped watching messages from ${device}`)
	}
}

export function* watchUserSentMessages (socket: WebSocket, device: string) {
	const send = (message: string) => socket.send(message)
	try {
		while (true) {
			const { payload } = yield take<any>((action: Action) => {
				return action.type === 'DEVICE_MSG' && action.meta === device
			})
			send(payload)
		}
	} finally {
		console.log(`Stopped watching messages to ${device}`)
	}
}

export function* socketChannel (socket: WebSocket) {
	return eventChannel(emitter => {
		socket.addEventListener('open', event => {
			emitter(event)
		})
		socket.addEventListener('message', event => {
			emitter(event.data)
		})
		socket.addEventListener('close', event => {
			emitter(END)
		})
		socket.addEventListener('error', event => {
			console.error(event)
			emitter(END)
		})
		return () => {
			if (socket.readyState === socket.OPEN)
				socket.close()

			// TODO: Figure out if event listeners needs to be removed
		}
	})
}
