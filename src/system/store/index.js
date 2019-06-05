import * as utils from 'utils/store'
import * as app from './app'
import * as sys from './system'

export const api = {
	...utils,
	...app,
	...sys,
}

export * from 'utils/store'
export * from './app'
export * from './system'
