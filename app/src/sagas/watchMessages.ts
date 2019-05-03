import { eventChannel } from 'redux-saga'
/*
export default function* watchMessages () {
	const msgChannel = yield call(socketChannel, socket)
	try {
		while (true) {
			const data = yield take(msgChannel)
			const msg: WSMessage = JSON.parse(data)
			if (msg.type === 'IRC') {
				const args: string[] = msg.data.split(paramSep).slice(1)
				const command = args.shift() as COMMAND
				console.log(command, args)
				switch (command) {
					case 'JOIN':
						yield put(tabAdded(args[0], socket.url))
						break

					case 'MSG': {
						const [sender, channel, message] = args
						yield put(receive(
							socket.url,
							channel,
							{
								sender,
								message,
								timestamp: Date.now()
							}
						))
					}

					case 'RPL_NAMREPLY':
						const [_a, _b, channel, users] = args
						yield put(getUsers(socket.url, channel, users.split(' ')))
						break

					case 'PONG':
						break

					default:
						yield put(receive(
							socket.url,
							'STATUS',
							{
								sender: '<server>',
								message: args[args.length - 1],
								timestamp: Date.now()
							}
						))
						break
				}
			}

		}
	} finally {
		console.log(`Stopped watching messages from ${socket.url}`)
	}
}
*/

export function* socketChannel (socket: WebSocket) {
	return eventChannel(emitter => {
		socket.onmessage = event => {
			emitter(event.data)
			// TODO: Handle non-irc message events
		}
		return socket.close
	})
}
