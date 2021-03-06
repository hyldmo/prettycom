import { Action, Actions } from 'actions'
import { DEFAULT_PORT } from 'consts'
import { call, cancelled, put, race, select, spawn, take, takeEvery } from 'redux-saga/effects'
import { SerialDevice, State } from 'types'
import { deviceName, logName, sleep } from 'utils'
import { waitForOpen } from './watchMessages'

export default function* () {
	yield takeEvery('LOGGING_ENABLE', enableLog)
}

const maxRetries = 10

function* enableLog (action: Action<'LOGGING_ENABLE'>, retries = maxRetries): any {
	const { payload, meta } = action
	const { remotePort: port, deviceNames }: State['settings'] = yield select((s: State) => s.settings)
	const device: SerialDevice | undefined = yield select((s: State) => s.devices.find(d => d.path === meta))
	if (!device || !payload)
		return

	const name = deviceName(device, deviceNames)
	const filename = logName(device, deviceNames)
	const URI = `ws://localhost:${port || DEFAULT_PORT}?mode=LOG&filename=${filename}`
	const socket = new WebSocket(URI)
	try {
		yield call(waitForOpen, socket)
		console.info(`<${name}> Started logging to ${filename}`)
		retries = maxRetries

		const [, event]: [undefined, Action<'LOGGING_UPDATE'> | undefined] = yield race([
			call(watchLog, socket, device.path),
			take((a: Action) => a.type === 'LOGGING_UPDATE' && a.meta === device.path),
			take((a: Action) => a.type === 'LOGGING_ENABLE' && a.meta === device.path),
			take((a: Action) => a.type === 'DISCONNECT' && a.meta === device.path)
		])
		if (event?.type === 'LOGGING_UPDATE')
			yield put(Actions.enableLog(action.payload, event.meta))
	} catch (err) {
		console.error(err)
		const message: string | undefined = err.message
		if (message) {
			const code = Number.parseInt(message.split(':')[0], 10)
			if (code === 1006 && retries-- > 0) {
				if (!(yield cancelled())) {
					yield call(sleep, 1000 * Math.pow(2, maxRetries - retries))
					yield spawn(enableLog, action, --retries)
				}
			} else {
				alert(err.message)
			}
		}
	} finally {
		if (socket.readyState === socket.OPEN)
			socket.close()

		console.info(`<${name}> Stopped logging to ${filename}`)
	}
}

export function* watchLog (socket: WebSocket, device: string) {
	while (true) {
		const { payload }: Action<'DEVICE_DATA_RECEIVED'> = yield take((action: Action) => action.type === 'DEVICE_DATA_RECEIVED' && action.meta === device)
		socket.send(`${payload.timestamp.toISOString()}; ${payload.content}\n`)
	}
}
