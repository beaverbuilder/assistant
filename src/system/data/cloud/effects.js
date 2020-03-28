import { getWpRest } from 'utils/wordpress'
import cloud from 'utils/cloud'

import {
	fetchCloudUser,
	setCloudToken,
	setCloudUser,
	setIsCloudConnected,
	setCloudErrors
} from './actions'

const wpapi = getWpRest()

export const after = {
	ATTEMPT_CLOUD_LOGIN: ( action, store ) => {
		store.dispatch( setCloudErrors( [] ) )

		cloud.auth.login( action.email, action.password )
			.then( ( token ) => {
				store.dispatch( setCloudToken( token ) )
				store.dispatch( setCloudErrors( [] ) )
				store.dispatch( setIsCloudConnected( true ) )
			} )
			.catch( ( error ) => {
				const messages = []

				if ( error.response && 401 == error.response.status ) {
					messages.push( 'Invalid Credentials' )
				} else {
					messages.push( error.message )
				}

				store.dispatch( setCloudErrors( messages ) )
				store.dispatch( setIsCloudConnected( false ) )
			} )
	},

	ATTEMPT_CLOUD_REGISTER: ( action, store ) => {

	},

	ATTEMPT_CLOUD_LOGOUT: ( action, store ) => {
		cloud.auth.logout().then( () => {
			store.dispatch( setCloudToken( {} ) )
			store.dispatch( setCloudErrors( [] ) )
			store.dispatch( setIsCloudConnected( false ) )
		} )
	},

	SET_CLOUD_TOKEN: ( action, store ) => {
		const token = store.getState().token
		if ( cloud.session.isValidToken( token ) ) {
			store.dispatch( fetchCloudUser() )
		}
	},

	FETCH_CLOUD_USER: ( action, store ) => {
		cloud.auth.fetchCurrentUser()
			.then( ( user ) => {
				store.dispatch( setCloudUser( user ) )
			} )
	}
}
