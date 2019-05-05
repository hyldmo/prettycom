import reducers from 'reducers'
export * from './tracker'
export * from './serial'

export type State = ReturnType<typeof reducers>

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
