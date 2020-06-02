import { api as data } from 'data'
import { api as ui } from 'ui'
import utils from './utils'
import hooks from './hooks'

const api = window.FL || {}
const asst = FL.Assistant || {}
const {
	registerApp,
	toggleIsShowingUI,
} = data.getSystemActions()

const Assistant = {
	...asst,
	registerApp,
	toggleUI: toggleIsShowingUI,
	data,
	ui,
	utils,
	hooks,
}

window.FL = {
	...api,
	Assistant,
}
