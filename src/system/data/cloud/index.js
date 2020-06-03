import { registerStore, useStore, getStore, getDispatch, getSelectors, getHooks } from '../registry'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import cloud from 'utils/cloud'

const KEY = 'fl-assistant/cloud'

const state = {
	isCloudConnected: cloud.auth.isConnected(),
	cloudToken: cloud.session.getToken(),
	cloudUser: cloud.session.getUser(),
	currentTeam: 0,
}

registerStore( 'fl-assistant/cloud', {
	state,
	actions,
	reducers,
	effects,
	selectors,
} )

export const useCloudState = shouldUpdate => useStore( KEY, shouldUpdate )

export const getCloudStore = () => getStore( KEY )

export const getCloudActions = () => getDispatch( KEY )

export const getCloudSelectors = () => getSelectors( KEY )

export const getCloudHooks = () => getHooks( KEY )
