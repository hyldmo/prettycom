import { eventChannel } from 'redux-saga';
import { call, cancel, fork, put, select, take, takeEvery, takeLatest  } from 'redux-saga/effects'
import { Actions } from '../actions'
import { socketChannel } from './watchMessages'

export default function* watchConnects () {
	yield takeEvery('CONNECT', connectToServer)
	yield takeLatest('LIST', listDevices)
}

function* watchDeviceList (socket: WebSocket) {
	const msgChannel = yield call(socketChannel, socket)
	try {
		while (true) {
			const data = yield take(msgChannel)
			console.log(data)
		}
	} finally {
		console.log(`Stopped watching messages from ${socket.url}`)
	}
}

function* listDevices (action: typeof Actions.listDevices) {
	try {
		const URI = `ws://localhost:31130?mode=LIST`
		const socket = new WebSocket(URI)
		yield put(Actions.connecting(socket.url))
		const channel = yield call(connectChannel, socket)

		while (true) {
			yield take(channel)
			yield put(Actions.connected(socket.url))
			const messageTask = yield fork(watchDeviceList, socket)
			yield take((a: any) =>  a.type === 'CLOSE_TAB' && a.payload === socket.url)
			yield cancel(messageTask)
		}
	} finally {
		console.log('Disconnected')
	}
}

function* connectToServer (action: any) {
	yield select((s: any) => s)
	/*
	try {
		const { server, port, username, password, channels } = action.payload
		const URI = `ws://localhost:31130?server=${server}&port=${port}&username=${username}&password=${password}&channels=${encodeURIComponent(channels)}`
		const socket = new WebSocket(URI)
		yield put(Actions.connecting(socket.url))
		const channel = yield call(connectChannel, socket)

		while (true) {
			yield take(channel)
			yield put(Actions.connected(socket.url))
			const userMessageTask = yield fork(watchUserSentMessages, socket)
			const messageTask = yield fork(watchMessages, socket)
			yield take((a: IAction<string>) =>  a.type === 'CLOSE_TAB' && a.payload === socket.url)
			yield cancel(userMessageTask)
			yield cancel(messageTask)
		}
	} finally {
		console.log('Disconnected')
	}
	*/
}

/*
function* watchUserSentMessages (socket: WebSocket) {
	const send = (message: ClientMessage) => socket.send(JSON.stringify(message))
	try {
		while (true) {
			type MessageAction = IActionMeta<string, {channel: string, server: string}>
			const { payload, meta }: MessageAction = yield take((action: MessageAction) => {
				return action.type === 'SEND_MESSAGE' && action.meta.server === socket.url
			})
			if (payload.startsWith('/'))
				send({
					channel: 'STATUS',
					message: payload.substring(1)
				})
			else
				send({
					channel: meta.channel,
					message: payload
				})
		}
	} finally {
		console.log(`Stopped watching messages to ${socket.url}`)
	}
}
*/

function* connectChannel (socket: WebSocket) {
	return eventChannel(emitter => {
		socket.onopen = event => {
			emitter(event)
		}
		return socket.close
	})
}
