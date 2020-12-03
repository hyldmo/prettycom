import Server from '../app/server'

const args = process.argv[2]?.split(':')
const [host, port] = args || [];

const options = {
	host: host || 'localhost',
	port: Number.parseInt(port) || 31130
}

console.log(`Server starting on ${host}:${port}`)
const server = new Server(options)