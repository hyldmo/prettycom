import path from 'path'
import fs from 'fs-extra'
import log from './log'

export class DeviceLogger {
	public readonly path: string
	private fd = 0

	constructor (filename: string) {
		const app = require('electron').remote.app
		const folder = path.join(app.getPath('home'), 'prettycom')
		this.path = path.join(folder, filename)

		fs.mkdirp(folder)
		fs.open(this.path, 'w', (err, fd) => {
			if (err) {
				log('error', err)
				this.onClose()
			}
			else
				this.fd = fd
		})
	}

	public onClose: () => void = () => {/* Do nothing */}

	public write (line: any) {
		if (!this.fd)
			return

		fs.write(this.fd, line, err => {
			if (!err)
				return

			log('error', err)
			this.close()
		})
	}

	public close () {
		fs.close(this.fd)
		this.fd = 0
		this.onClose()
	}

}
