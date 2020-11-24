import { actionCreator } from './actionCreator'

export default {
	fetchVersion: actionCreator<'FETCH_VERSION', string>('FETCH_VERSION'),
	versionFetched: actionCreator<'VERSION_FETCHED', string>('VERSION_FETCHED')
}
