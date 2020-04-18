import * as auth from './auth'
import * as session from './session'
import { getCloudActions } from 'data/cloud'

/**
 * Auth API
 */
export { auth, session }

/**
 * Register
 */
export const cloudRegister = ( first_name, last_name, email, password ) => {
	return auth.register( first_name, last_name, email, password )
}

/**
 * Login
 */
export const cloudLogin = ( email, password ) => {
	const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
	return auth.login( email, password )
		.then( ( { token, user } ) => {
			setCloudToken( token )
			setCloudUser( user )
			setIsCloudConnected( true )
		} )
}

/**
 * Logout
 */
export const cloudLogout = () => {
	const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
	setCloudToken( {} )
	setCloudUser( null )
	setIsCloudConnected( false )
	return auth.logout()
}

/**
 * Password Reset
 */
export const cloudPasswordReset = ( email ) => {
	return new Promise( ( resolve ) => {
		setTimeout( () => {
			resolve()
		}, 1000 )
	} )
}
