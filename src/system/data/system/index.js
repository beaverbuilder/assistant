import {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors,
	getHooks
} from '../registry'

import { getWpRest } from 'utils/wordpress'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import useAppList from './use-app-list'
import cloud from '../../cloud'

const KEY = 'fl-assistant/system'

registerStore( KEY, {
	state: {
		...FL_ASSISTANT_INITIAL_STATE,
		isCloudConnected: cloud.auth.isConnected(),
		cloudUser: null,
		notices: [],
	},
	cache: [
		'cloudUser'
	],
	actions,
	reducers,
	effects,
	selectors,
} )

if ( cloud.auth.isConnected() ) {
	cloud.user.get().then( response => {
		const { setCloudUser } = getDispatch( KEY )
		setCloudUser( response.data )
	} )
}

export const getSystemStore = () => getStore( KEY )

export const useSystemState = shouldUpdate => useStore( KEY, shouldUpdate )

export const getSystemState = () => getStore( KEY ).getState()

export const getSystemActions = () => getDispatch( KEY )

export const getSystemSelectors = () => getSelectors( KEY )

export const getSystemHooks = () => getHooks( KEY )

export const getSystemConfig = () => ( { ...FL_ASSISTANT_CONFIG } )

export { useAppList }


// Set up Counts
getWpRest().batch().get( {
	'/fl-assistant/v1/counts': counts => {
		const { setCounts } = getSystemActions()
		setCounts( counts )
	},
	'/fl-assistant/v1/labels': labels => {
		const { setLabels } = getSystemActions()
		setLabels( labels )
	}
} )
