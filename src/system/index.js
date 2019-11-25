import { api as data } from 'store'
import { api as ui } from 'lib'
import utils from './utils'

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
}

window.FL = {
	...api,
	Assistant,
}

// After everything is set up
import './config'
