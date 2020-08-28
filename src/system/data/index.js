import * as registry from './registry'
import * as app from './app'
import * as updater from './updater'
import * as sys from './system'

export const api = {
	...registry,
	...sys,
	...app,
	...updater,
}

export * from './registry'
export * from './app'
export * from './updater'
export * from './system'
