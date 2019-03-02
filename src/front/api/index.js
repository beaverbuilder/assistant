import vendor from './vendor'
import * as components from 'components'
import * as store from 'store'
import * as utils from 'utils'
const { registerApp } = store.getSystemActions()

window.FLAssistant = {
    vendor,
    components,
    store,
    utils,
    registerApp,
}
