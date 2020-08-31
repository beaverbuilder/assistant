import * as registry from './registry'
import * as app from './app'
import * as updater from './updater'
import * as sys from './system'
import * as widget from './widget'

export const api = {
	...registry,
	...sys,
	...app,
	...updater,
	...widget,
}

export * from './registry'
export * from './app'
export * from './updater'
export * from './system'
export * from './widget'
