import * as store from './store'
import * as lib from './lib'
import * as utils from 'utils'
import * as i18n from '@wordpress/i18n'

const fl = window.FL || {}
const asst = fl.Assistant || {}
const { registerApp } = store.getSystemActions()

const Assistant = {
	...asst,
	registerApp,
	__: i18n.__,
	i18n,
	store,
	lib,
	utils,
}

window.FL = {
	...fl,
	Assistant,
}
