import * as utils from 'shared-utils/store'
import * as app from './app'
import * as updater from './updater'
import * as sys from './system'

export const api = {
	...utils,
	...app,
	...updater,
	...sys,
}

export * from 'shared-utils/store'
export * from './app'
export * from './updater'
export * from './system'
