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

export const getSystemStore = () => getStore( KEY )

export const useSystemState = shouldUpdate => useStore( KEY, shouldUpdate )

export const getSystemState = () => getStore( KEY ).getState()

export const getSystemActions = () => getDispatch( KEY )

export const getSystemSelectors = () => getSelectors( KEY )

export const getSystemHooks = () => getHooks( KEY )

export const getSystemConfig = () => ( { ...FL_ASSISTANT_CONFIG } )

export { useAppList }

/**
 * Ensure cloud was connected to this WP user. Refresh
 * the user data if successful.
 */
if ( cloud.auth.isConnected() ) {
	const { setCloudUser, setIsCloudConnected } = getDispatch( KEY )
	const { cloudUser } = getStore( KEY ).getState()
	const { currentUser } = FL_ASSISTANT_CONFIG

	if ( cloudUser?.wpId !== currentUser.id ) {
		setIsCloudConnected( false )
	} else {
		cloud.user.get().then( response => {
			setCloudUser( {
				...response.data,
				wpId: currentUser.id
			} )
		} )
	}
}

/**
 * Setup initial REST batch requests.
 */
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
