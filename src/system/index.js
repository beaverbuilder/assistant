import { api as data } from './data'
import { api as ui } from './ui'
import utils from './utils'
import hooks from './hooks'
import cloud from './cloud'

const api = window.FL || {}
const asst = FL.Assistant || {}
const { registerApp, toggleIsShowingUI } = data.getSystemActions()

const Assistant = {
	...asst,
	data,
	ui,
	utils,
	hooks,
	cloud,
	// Top-level convenience functions
	registerApp,
	toggleUI: toggleIsShowingUI,
}

window.FL = {
	...api,
	Assistant,
}
