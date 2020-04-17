import { auth, session } from 'utils/cloud'
import { getCache, setCache } from 'utils/cache'
import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'

const cache = getCache( 'fl-cloud', 'state' ) // Test cache for mock data

const state = {
	isCloudConnected: auth.isConnected(),
	cloudToken: session.getToken(),
	cloudUser: session.getUser()
}

registerStore( 'fl-assistant/cloud', {
	state: cache ? { ...state, ...cache } : state,
	actions,
	reducers,
	effects,
	selectors,
} )

getStore( 'fl-assistant/cloud' ).subscribe( () => {
	const state = getStore( 'fl-assistant/cloud' ).getState()
	setCache( 'fl-cloud', 'state', state, false )
} )

export const useCloudState = () => {
	return useStore( 'fl-assistant/cloud' )
}

export const getCloudStore = () => {
	return getStore( 'fl-assistant/cloud' )
}

export const getCloudActions = () => {
	return getDispatch( 'fl-assistant/cloud' )
}

export const getCloudSelectors = () => {
	return getSelectors( 'fl-assistant/cloud' )
}
