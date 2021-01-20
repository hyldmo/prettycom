import { ServerOptions } from 'ws'
import { Server } from '../../server'
import { Dialog } from 'electron'

declare global {
	interface Window {
		server: Server
		reloadServer: (options: ServerOptions) => void
		nodeOpen: (url: string) => void

		ElectronDialog: Dialog
		FSreadFile: (file: string | Buffer | number, encoding: string) => Promise<string>
	}
}
