import { registerStore, useStore, getStore, getDispatch } from 'shared-utils/store'
import cloud from 'shared-utils/cloud'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'

registerStore( 'fl-assistant/system', {
	state: {
		...FL_ASSISTANT_INITIAL_STATE,
		isCloudConnected: cloud.auth.isConnected(),
		cloudToken: cloud.session.getToken(),
		currentUser: cloud.session.getUser(),
		loginErrors: []
	},
	actions,
	reducers,
	effects,
} )

export const useSystemState = () => {
	return useStore( 'fl-assistant/system' )
}

export const getSystemStore = () => {
	return getStore( 'fl-assistant/system' )
}

export const getSystemActions = () => {
	return getDispatch( 'fl-assistant/system' )
}

export const getSystemConfig = () => {
	return { ...FL_ASSISTANT_CONFIG }
}
