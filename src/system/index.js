import { api as data } from 'data'
import { api as ui } from 'ui'
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
