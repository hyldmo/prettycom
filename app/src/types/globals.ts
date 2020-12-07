import { ServerOptions } from 'ws'
import { Server } from '../../server'

declare global {
	interface Window {
		server: Server
		reloadServer: (options: ServerOptions) => void
		nodeOpen: (url: string) => void
	}
}
