import { Action, Actions } from 'actions'
import { Settings } from 'reducers/settings'
import { END, eventChannel } from 'redux-saga'
import { call, put, race, select, take } from 'redux-saga/effects'
import { Direction, State } from 'types'
import { showMessage, sleep } from 'utils'

export function* watchMessages (socket: WebSocket, device: string) {
	const msgChannel = yield call(socketChannel, socket)
	const timeout = yield select((s: State) => s.settings.reconnectDelay * 1000)
	const useFilters = yield select((s: State) => s.devices.find(d => d.path == device)?.useFilters)
	const filters: Settings['filters'] = yield select((s: State) => s.settings.filters)

	while (true) {
		const [event]: [WebSocketEventMap['message']] = yield race([
			take(msgChannel),
			call(sleep, timeout || 9999999999999)
		])
		if (!event)
			throw new Error('4502: No message received within timeout threshold.')
		const message: string = event.data

		const data = { timestamp: new Date(), content: message, direction: Direction.Received }

		if (!useFilters || showMessage(data, filters))
			yield put(Actions.dataReceived(data, device))
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
