import vendor from './vendor'
import * as components from 'components'
import * as store from 'store'
const { registerApp } = store.getSystemActions()

window.FLAssistant = {
    vendor,
    components,
    store,
    registerApp,
}
