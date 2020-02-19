import { registerAppStore } from '../app'
import { getWpRest } from 'utils/wordpress'
import cloud from 'utils/cloud'

import {
	fetchCurrentUser,
	setCloudToken,
	setCurrentUser,
	setIsCloudConnected,
	setLoginErrors
} from './actions'

const wpapi = getWpRest()

/**
 * Effects that fire before an action.
 */
export const before = {

	REGISTER_APP: ( action ) => {
		if ( action.config.state && false !== action.config.enabled ) {
			registerAppStore( {
				key: action.key,
				...action.config,
			} )
		}
	},
}

/**
 * Effects that fire after an action.
 */
export const after = {
	ATTEMPT_LOGIN: ( action, store ) => {
		store.dispatch( setLoginErrors( [] ) )

		cloud.auth.login( action.email, action.password )
			.then( ( token ) => {
				store.dispatch( setCloudToken( token ) )
				store.dispatch( setLoginErrors( [] ) )
				store.dispatch( setIsCloudConnected( true ) )
			} )
			.catch( ( error ) => {
				const messages = []

				if ( error.response && 401 == error.response.status ) {
					messages.push( 'Invalid Credentials' )
				} else {
					messages.push( error.message )
				}

				store.dispatch( setLoginErrors( messages ) )
				store.dispatch( setIsCloudConnected( false ) )
			} )
	},

	ATTEMPT_LOGOUT: ( action, store ) => {
		cloud.auth.logout().then( () => {
			store.dispatch( setCloudToken( {} ) )
			store.dispatch( setLoginErrors( [] ) )
			store.dispatch( setIsCloudConnected( false ) )
		} )
	},

	SET_CLOUD_TOKEN: ( action, store ) => {
		const token = store.getState().cloudToken
		if ( cloud.session.isValidToken( token ) ) {
			store.dispatch( fetchCurrentUser() )
		}
	},

	FETCH_CURRENT_USER: ( action, store ) => {
		cloud.auth.fetchCurrentUser()
			.then( ( user ) => {
				store.dispatch( setCurrentUser( user ) )
			} )
	},

	SET_APP_POSITION: ( action, store ) => {
		const { appOrder } = store.getState()
		wpapi.users().updateState( { appOrder } )
	},

	SET_WINDOW: ( action, store ) => {
		const { window } = store.getState()
		wpapi.users().updateState( { window: { ...window } } )
	},

	SET_BRIGHTNESS: ( action, store ) => {
		const { appearance } = store.getState()
		wpapi.users().updateState( { appearance } )
	},

	SET_SHOULD_SHOW_LABELS: ( action, store ) => {
		const { shouldShowLabels } = store.getState()
		wpapi.users().updateState( { shouldShowLabels } )
	},

	SET_HISTORY: ( action, store ) => {
		const { history } = store.getState()
		wpapi.users().updateState( { history } )
	},

	SET_CURRENT_HISTORY_STATE: ( action, store ) => {
		const { history } = store.getState()
		wpapi.users().updateState( { history } )
	},

	SET_SEARCH_HISTORY: ( action, store ) => {
		const { searchHistory } = store.getState()
		wpapi.users().updateState( { searchHistory } )
	},

	TOGGLE_IS_SHOWING_UI: ( action, store ) => {
		const { window } = store.getState()
		wpapi.users().updateState( { window: { ...window } } )
	},
}
