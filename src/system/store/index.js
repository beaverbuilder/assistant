import * as utils from 'shared-utils/store'
import * as app from './app'
import * as sys from './system'

export const api = {
	...utils,
	...app,
	...sys,
}

export * from 'shared-utils/store'
export * from './app'
export * from './system'
