import { api as data } from './data'
import * as ui from './ui'
import utils from './utils'
import cloud from './cloud'

const FL = window.FL || {}
const existing = FL.Assistant || {}
const { registerApp, toggleIsShowingUI } = data.getSystemActions()

const getActions = () => ( {
	registerApp,
	toggleUI: toggleIsShowingUI,
} )

const getConfig = () => data.getSystemConfig()

// Public FL.Assistant api
const Assistant = {
	...existing,
	env: 'wordpress',
	data,
	ui,
	utils,
	cloud,

	// Top-level convenience functions
	getActions,
	getConfig,

	// Would love to remove someday
	registerApp,
	toggleUI: toggleIsShowingUI,
}

window.FL = {
	...FL,
	Assistant,
}
