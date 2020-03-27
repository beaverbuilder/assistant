import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import cloud from 'utils/cloud'

registerStore( 'fl-assistant/cloud', {
	state: {
		isCloudConnected: cloud.auth.isConnected(),
		cloudToken: cloud.session.getToken(),
		cloudUser: cloud.session.getUser(),
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
