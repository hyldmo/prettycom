import { push } from 'connected-react-router'
import { call, put, race, select, spawn, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { PortInfo } from 'serialport'
import { SerialDevice, State } from 'types'
import { sleep } from 'utils'
import { Action, Actions } from '../actions'
import { socketChannel, waitForOpen, watchMessages, watchUserSentMessages } from './watchMessages'

export default function* watchConnects () {
	yield takeEvery('CONNECT', connectToServer)
	yield takeLatest('DEVICE_LIST', listDevices)
	yield takeLatest(Actions.enableLog.type, enableLog)
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
					yield put(Actions.addDevice(device, device.path))
					break
				case 'REMOVE':
					yield put(Actions.removeDevice(device, device.path))
					break
				default:
					console.warn(`Unknown wss message type ${type}`)
					break
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
		console.log(`Stopped watching for devices from ${socket.url}`)
	}
}

function* listDevices () {
	try {
		const URI = 'ws://localhost:31130?mode=LIST'
		const socket = new WebSocket(URI)
		const channel = yield call(socketChannel, socket)

		yield take(channel)
		yield call(watchDeviceList, socket)
	} finally {
		console.log('Disconnected from device listing')
	}
}

function* connectToServer (action: typeof Actions.connect, retries = 5): any {
	const { baud, device } = action.payload
	const URI = `ws://localhost:31130?mode=CONNECT&baud=${baud}&device=${encodeURIComponent(device)}`
	const socket = new WebSocket(URI)
	try {
		yield put(Actions.connecting(null, device))
		yield call(waitForOpen, socket)
		yield put(Actions.connected(null, device))
		if (location.hash.includes('connect'))
			yield put(push('/'))
		retries++

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
			if (code === 1006 && retries > 0) {
				yield call(sleep, 400)
				return yield spawn(connectToServer, action, --retries)
			} else {
				alert(err.message)
			}
		}
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()

		console.log(`Disconnected from ${device}`)
		yield put(Actions.disconnected(null, device))
	}
}

function* enableLog (action: typeof Actions.enableLog, retries = 5): any {
	const { payload, meta } = action
	const device: SerialDevice | undefined = yield select((s: State) => s.devices.find(d => d.path === meta))
	if (!device || !payload)
		return

	const URI = `ws://localhost:31130?mode=LOG&filename=${device.logname}`
	const socket = new WebSocket(URI)
	try {
		yield call(waitForOpen, socket)
		retries++

		yield race([
			call(watchLog, socket, device.path),
			take<any>((a: Action) =>  a.type === 'DISCONNECT' && a.meta === device.path)
		])
	} catch (err) {
		console.error(err)
		const message: string | undefined = err.message
		if (message) {
			const code = Number.parseInt(message.split(':')[0], 10)
			if (code === 1006 && retries > 0) {  // Check if error was disconnection
				yield call(sleep, 400)
				return yield spawn(enableLog, action, --retries)
			} else {
				alert(err.message)
			}
		}
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()

		console.log(`Stopped logging from ${device.path}`)
	}
}

export function* watchLog (socket: WebSocket, device: string) {
	while (true) {
		const { payload }: typeof Actions.dataReceived = yield take<any>((action: Action) => action.type === 'DEVICE_DATA_RECEIVED' && action.meta === device)
		socket.send(`${payload.timestamp.toISOString()}; ${payload.content}\n`)
	}
}
