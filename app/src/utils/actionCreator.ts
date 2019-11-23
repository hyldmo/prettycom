type Action<T, P = undefined, M = undefined> = { type: T, payload: P, meta: M }
type EmptyActionCreator<T> =      Action<T>&(() => { type: T })
type ActionCreator<T, P> =        Action<T, P>&((payload: P) =>  { type: T, payload: P })
type ActionMetaCreator<T, P, M> = Action<T, P, M>&((payload: P, meta: M) => { type: T, payload: P, meta: M })

export function createAction<T>       (type: T): EmptyActionCreator<T>
export function createAction<T, P>    (type: T): ActionCreator<T, P>
export function createAction<T, P, M> (type: T): ActionMetaCreator<T, P, M>
export function createAction<T, P, M> (type: T): EmptyActionCreator<T>&ActionCreator<T, P>&ActionMetaCreator<T, P, M> {
	const action: any = (payload?: P, meta?: M) => ({
		type,
		payload,
		meta
	})
	action.type = type
	return action
}
