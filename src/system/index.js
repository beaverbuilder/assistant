import * as store from './store'
import * as lib from 'lib'
import * as utils from 'utils'

const fl = window.FL || {}
const asst = fl.Assistant || {}
const { registerApp } = store.getSystemActions()

const Assistant = {
	...asst,
	registerApp,
	store,
	lib: { ...lib },
	utils,
}

window.FL = {
	...fl,
	Assistant,
}
