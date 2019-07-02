import { api as data } from './store'
import { api as ui } from './lib'
import { api as utils } from './utils'
import * as i18n from '@wordpress/i18n'

const fl = window.FL || {}
const asst = fl.Assistant || {}
const { registerApp } = data.getSystemActions()

const Assistant = {
	...asst,
	registerApp,
	__: i18n.__,
	i18n,
	data,
	ui,
	utils,
}

window.FL = {
	...fl,
	Assistant,
}
