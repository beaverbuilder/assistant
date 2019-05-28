import vendor from './vendor'
import components from './components'
import store from './store'
import * as utils from 'utils'
const { registerApp } = store.getSystemActions()

window.UNSTABLE_FLAssistant = {
	vendor,
	components,
	store,
	utils,
	registerApp,
}
