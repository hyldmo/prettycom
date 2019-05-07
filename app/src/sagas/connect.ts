import { call, cancel, fork, put, take, takeEvery, takeLatest  } from 'redux-saga/effects'
import { PortInfo } from 'serialport'
import { Actions } from '../actions'
import { socketChannel, watchMessages, watchUserSentMessages } from './watchMessages'

export default function* watchConnects () {
	yield takeEvery('CONNECT', connectToServer)
	yield takeLatest('DEVICE_LIST', listDevices)
}

function* watchDeviceList (socket: WebSocket) {
	const msgChannel = yield call(socketChannel, socket)
	try {
		while (true) {
			const message: string = yield take(msgChannel)
			const type = message.substr(0, message.indexOf(':'))
			const data = message.substr(message.indexOf(':') + 1)
			const device: PortInfo = JSON.parse(data)
			switch (type) {
				case 'ADD':
					yield put(Actions.addDevice(device, device.comName))
					break
				case 'REMOVE':
					yield put(Actions.removeDevice(device, device.comName))
					break
			}
		}
	} finally {
		console.log(`Stopped watching for devices from ${socket.url}`)
	}
}

function* listDevices () {
	try {
		const URI = `ws://localhost:31130?mode=LIST`
		const socket = new WebSocket(URI)
		const channel = yield call(socketChannel, socket)

		yield take(channel)
		yield fork(watchDeviceList, socket)
	} finally {
		console.log('Disconnected from device listing')
	}
}

function* connectToServer (action: typeof Actions.connect) {
	const { baud, device } = action.payload
	const URI = `ws://localhost:31130?mode=CONNECT&baud=${baud}&device=${encodeURIComponent(device)}`
	const socket = new WebSocket(URI)
	try {
		yield put(Actions.connecting(socket.url))
		const channel = yield call(socketChannel, socket)

		yield take(channel)
		yield put(Actions.connected(null, device))
		const userMessageTask = yield fork(watchUserSentMessages, socket, device)
		const messageTask = yield fork(watchMessages, socket, device)

		yield take((a: any) =>  a.type === 'DISCONNECT' && a.meta === device)
		yield cancel(userMessageTask)
		yield cancel(messageTask)
	} catch (err) {
		console.error('UH OH SPAGHETTIO')
		yield put(Actions.disconnect(null, device))
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()

		console.log(`Disconnected from ${device}`)
	}
}
