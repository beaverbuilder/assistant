import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import { auth, session } from 'utils/cloud'

registerStore( 'fl-assistant/cloud', {
	state: {
		isCloudConnected: auth.isConnected(),
		cloudToken: session.getToken(),
		cloudUser: session.getUser(),
		cloudErrors: []
	},
	actions,
	reducers,
	effects,
	selectors,
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
