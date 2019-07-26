import {registerAppStore} from '../app'
import {updateUserState} from 'shared-utils/wordpress'
import cloud from 'shared-utils/cloud'

import {
	fetchCurrentUser,
	setCloudToken, setCurrentUser,
	setIsCloudConnected,
	setLoginErrors
} from './actions'

/**
 * Effects that fire before an action.
 */
export const before = {

	REGISTER_APP: ( action ) => {
		registerAppStore( {
			key: action.key,
			...action.config,
		} )
	},
}

/**
 * Effects that fire after an action.
 */
export const after = {
	ATTEMPT_LOGIN: ( action, store ) => {
		console.log( 'attempting Login' )

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
			console.log( 'Auth token exists', store.getState().cloudToken )
			store.dispatch( fetchCurrentUser() )
		}
	},
	FETCH_CURRENT_USER: ( action, store ) => {
		cloud.auth.fetchCurrentUser()
			.then( ( user ) => {
				store.dispatch( setCurrentUser( user ) )
			} )
	},

	SET_SHOULD_REDUCE_MOTION: ( action, store ) => {
		const {shouldReduceMotion} = store.getState()
		updateUserState( {shouldReduceMotion} )
	},

	SET_APP_POSITION: ( action, store ) => {
		const {appOrder} = store.getState()
		updateUserState( {appOrder} )
	},

	SET_WINDOW: ( action, store ) => {
		const {window} = store.getState()
		updateUserState( {window: {...window}} )
	},

	SET_BRIGHTNESS: ( action, store ) => {
		const {appearance} = store.getState()
		updateUserState( {appearance} )
	},

	SET_SHOULD_SHOW_LABELS: ( action, store ) => {
		const {shouldShowLabels} = store.getState()
		updateUserState( {shouldShowLabels} )
	},

	SET_HISTORY: ( action, store ) => {
		const {history} = store.getState()
		updateUserState( {history} )
	},

	SET_SEARCH_HISTORY: ( action, store ) => {
		const {searchHistory} = store.getState()
		updateUserState( {searchHistory} )
	},
}
