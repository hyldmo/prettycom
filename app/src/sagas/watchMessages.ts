import { Action, Actions } from 'actions'
import { Settings } from 'reducers/settings'
import { END, eventChannel } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { Direction, State } from 'types'
import { showMessage } from 'utils'

// eslint-disable-next-line no-control-regex
const EOM = '\n' // End Of Message

export function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	let buffer = ''

	while (true) {
		const event: WebSocketEventMap['message'] = yield take(msgChannel)
		const msg: string = event.data

		buffer = buffer.concat(msg)
		if (msg.lastIndexOf(EOM) == msg.length - 1) {
			const messages = buffer.split(EOM).filter(str => str.length > 0)
			buffer = messages.length > 1 // Extract last part of transmission as it may not be finished yet
				? messages.pop() as string
				: ''

			const useFilters = yield select((s: State) => s.devices.find(d => d.path == device)?.useFilters)
			const filters: Settings['filters'] = yield select((s: State) => s.settings.filters)

			for (const message of messages) {
				const data = { timestamp: new Date(), content: message, direction: Direction.Received }
				if (useFilters && !showMessage(data, filters))
					continue
				yield put(Actions.dataReceived(data, device))
			}
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
			message: emitter,
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
