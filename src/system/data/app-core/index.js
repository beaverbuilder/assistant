import { registerStore, useStore, getStore, getDispatch, getSelectors, getHooks } from '../registry'
import * as actions from './actions'
import * as reducers from './reducers'
//import * as effects from './effects'
//import * as selectors from './selectors'

const KEY = 'apps-test'

registerStore( KEY, {
	state: {},
	actions,
	reducers,
} )




// Testing
const { registerApp, unregisterApp } = getDispatch( KEY )

registerApp( 'brent-test', {})

unregisterApp( 'brent-test' )

registerApp( 'inspector', {
    label: "Inspector",
    builtin: true,
    render: () => 'hi',
    isEnabled: true,
})
