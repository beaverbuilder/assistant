import { auth, session } from 'utils/cloud'
import { setCloudUser } from './actions'

export const after = {

	SET_CLOUD_TOKEN: ( action, store ) => {
		const token = store.getState().token
		if ( session.isValidToken( token ) ) {
			auth.fetchCurrentUser().then( ( user ) => {
				setCloudUser( user )
			} )
		}
	}
}
