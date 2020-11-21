import { Action, Actions } from 'actions'
import { DEFAULT_PORT } from 'consts'
import { call, cancelled, race, select, spawn, take, takeLatest } from 'redux-saga/effects'
import { SerialDevice, State } from 'types'
import { logName, sleep } from 'utils'
import { waitForOpen } from './watchMessages'

export default function* () {
	yield takeLatest(Actions.enableLog.type, enableLog)
}

const maxRetries = 10

function* enableLog (action: typeof Actions.enableLog, retries = maxRetries): any {
	const { payload, meta } = action
	const port = yield select((s: State) => s.settings.remotePort)
	const device: SerialDevice | undefined = yield select((s: State) => s.devices.find(d => d.path === meta))
	if (!device || !payload)
		return

	const URI = `ws://localhost:${port || DEFAULT_PORT}?mode=LOG&filename=${logName(device)}`
	const socket = new WebSocket(URI)
	try {
		yield call(waitForOpen, socket)
		retries = 10

		yield race([
			call(watchLog, socket, device.path),
			take<any>((a: Action) =>  a.type === 'DISCONNECT' && a.meta === device.path)
		])
	} catch (err) {
		console.error(err)
		const message: string | undefined = err.message
		if (message) {
			const code = Number.parseInt(message.split(':')[0], 10)
			if (code === 1006 && retries-- > 0) {
				if (!(yield cancelled())) {
					yield call(sleep, 1000 * Math.pow(2, maxRetries - retries))
					return yield spawn(enableLog, action, --retries)
				}
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
