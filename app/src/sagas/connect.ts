import { call, put, race, take, takeEvery, takeLatest, spawn  } from 'redux-saga/effects'
import { PortInfo } from 'serialport'
import { Action, Actions } from '../actions'
import { socketChannel, waitForOpen, watchMessages, watchUserSentMessages } from './watchMessages'

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
		yield call(watchDeviceList, socket)
	} finally {
		console.log('Disconnected from device listing')
	}
}

function* connectToServer (action: typeof Actions.connect): any {
	const { baud, device } = action.payload
	const URI = `ws://localhost:31130?mode=CONNECT&baud=${baud}&device=${encodeURIComponent(device)}`
	const socket = new WebSocket(URI)
	try {
		yield put(Actions.connecting(null, device))
		yield call(waitForOpen, socket)
		yield put(Actions.connected(null, device))

		yield race([
			call(watchUserSentMessages, socket, device),
			call(watchMessages, socket, device),
			take<any>((a: Action) =>  a.type === 'DISCONNECT' && a.meta === device)
		])
	} catch (err) {
		console.error(err)
		const message: string | undefined = err.message
		if (message) {
			const code = Number.parseInt(message.split(':')[0], 10)
			if (code === 1006)
				return yield spawn(connectToServer, action)
			else
				alert(err.message)
		}
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()

		console.log(`Disconnected from ${device}`)
		yield put(Actions.disconnected(null, device))
	}
}
