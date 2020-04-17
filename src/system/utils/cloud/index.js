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
export const cloudRegister = ( name, email, password ) => {
	return cloudRegisterWithMockData( name, email, password )
}

const cloudRegisterWithMockData = ( name, email ) => {
	const { setCloudToken, setCloudErrors, setCloudUser, setIsCloudConnected } = getCloudActions()

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			setCloudErrors( [] )
			setCloudToken( new Date().getTime() )
			setCloudUser( { name, email } )
			setIsCloudConnected( true )
			resolve()
		}, 1000 )
	} )
}

/**
 * Login
 */
export const cloudLogin = ( email, password ) => {
	const { setCloudToken, setCloudUser, setCloudErrors, setIsCloudConnected } = getCloudActions()

	return auth.login( email, password )
		.then( ( { token, user } ) => {
			setCloudErrors( [] )
			setCloudToken( token )
			setCloudUser( user )
			setIsCloudConnected( true )
		} )
}

/**
 * Logout
 */
export const cloudLogout = () => {
	const { setCloudToken, setCloudErrors, setCloudUser, setIsCloudConnected } = getCloudActions()

	setCloudErrors( [] )
	setCloudToken( {} )
	setCloudUser( null )
	setIsCloudConnected( false )
}

/**
 * Password Reset
 */
export const cloudPasswordReset = ( email ) => {
	return cloudPasswordResetWithMockData( email )
}

export const cloudPasswordResetWithMockData = () => {
	return new Promise( ( resolve ) => {
		setTimeout( () => {
			resolve()
		}, 1000 )
	} )
}
