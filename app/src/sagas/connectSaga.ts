import { push } from 'connected-react-router'
import { DEFAULT_PORT } from 'consts'
import { call, cancelled, put, race, select, spawn, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { PortInfo } from 'serialport'
import { State } from 'types'
import { selectHost, sleep } from 'utils'
import { Action, Actions } from '../actions'
import { socketChannel, waitForOpen, watchMessages, watchUserSentMessages } from './watchMessages'

export default function* watchConnects () {
	yield takeEvery('CONNECT', connectToServer)
	yield takeLatest('SETTINGS_REMOTE_SET', updateRemoteServer)
	yield takeLatest('DEVICE_LIST', listDevices)
	yield takeLatest('SETTINGS_SERVER_SET', serverUpdated)
	yield takeLatest(Actions.saveLoaded.type, onReady)
}
function* onReady (action: typeof Actions.saveLoaded) {
	yield call(updateRemoteServer, Actions.setRemote(action.payload.remotePort))
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

function* updateRemoteServer (action: ReturnType<typeof Actions.setRemote>) {
	yield call(sleep, 1000)
	const cancel = yield cancelled()
	if (cancel)
		return
	const options = action.payload
		? { port: Number.parseInt(action.payload, 10), host: '0.0.0.0' }
		: { port: DEFAULT_PORT }
	window.reloadServer(options)
	yield put(Actions.listDevices())
}

function* serverUpdated () {
	yield call(sleep, 2000)
	if (yield cancelled())
		return
	yield put(Actions.listDevices())
}

function* listDevices () {
	try {
		const settings: State['settings'] = yield select((s: State) => s.settings)
		const host = selectHost(settings)
		const URI = `ws://${host}?mode=LIST`
		const socket = new WebSocket(URI)
		const channel = yield call(socketChannel, socket)

		yield take(channel)
		yield call(watchDeviceList, socket)
	} catch (e) {
		console.error(e)
	} finally {
		yield call(sleep, 500)
		console.log('Disconnected from device listing, retrying')
		yield put(Actions.listDevices())
	}
}

const maxRetries = 10

function* connectToServer (action: typeof Actions.connect, retries = maxRetries): any {
	const { baud, device, url } = action.payload
	const URI = `ws://${url}?mode=CONNECT&baud=${baud}&device=${encodeURIComponent(device)}`
	const socket = new WebSocket(URI)
	try {
		yield put(Actions.connecting(null, device))
		yield call(waitForOpen, socket)
		yield put(Actions.connected(null, device))
		if (location.hash.includes('connect'))
			yield put(push('/'))
		retries = maxRetries

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
			if (code === 1006 && retries-- > 0) {
				if (!(yield cancelled())) {
					yield call(sleep, 1000 * Math.pow(2, maxRetries - retries))
					yield spawn(connectToServer, action, retries)
				}
			} else {
				alert(err.message)
			}
		}
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()
		else {
			console.log(`Disconnected from ${device}`)
		}
		yield put(Actions.disconnected(null, device))
	}
}

