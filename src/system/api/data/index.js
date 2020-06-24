import * as app from './app'
import * as cloud from './cloud'
import * as updater from './updater'
import * as sys from './system'
import * as registry from './registry'

export const api = {
	...app,
	...cloud,
	...updater,
	...sys,
	...registry,
}

export * from './app'
export * from './cloud'
export * from './updater'
export * from './system'
export * from './registry'
