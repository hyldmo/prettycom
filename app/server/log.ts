export default function log (level: keyof typeof console, ...args: any[]) {
	console[level]('Server: ', ...args)
}
