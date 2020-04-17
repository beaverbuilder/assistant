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
	const { setCloudToken, setCloudErrors, setIsCloudConnected } = getCloudActions()

	return auth.login( email, password ).then( ( token ) => {
		setCloudErrors( [] )
		setCloudToken( token )
		setIsCloudConnected( true )
	} )
	.catch( ( error ) => {
		const messages = []

		if ( error.response && 401 == error.response.status ) {
			messages.push( 'Invalid Credentials' )
		} else {
			messages.push( error.message )
		}

		setCloudErrors( messages )
		setIsCloudConnected( false )
	} )
}

export const cloudLoginWithMockData = ( email ) => {
	const { setCloudToken, setCloudErrors, setCloudUser, setIsCloudConnected } = getCloudActions()

	return new Promise( ( resolve ) => {
		setTimeout( () => {
			setCloudErrors( [] )
			setCloudToken( new Date().getTime() )
			setCloudUser( { name: 'Test User', email } )
			setIsCloudConnected( true )
			resolve()
		}, 1000 )
	} )
}

/**
 * Logout
 */
export const cloudLogout = () => {
	cloudLogoutWithMockData()

	// const { setCloudToken, setCloudErrors, setCloudUser, setIsCloudConnected } = getCloudActions()
	//
	// return auth.logout().then( () => {
	// 	setCloudErrors( [] )
	// 	setCloudToken( {} )
	// 	setCloudUser( null )
	// 	setIsCloudConnected( false )
	// } )
}

export const cloudLogoutWithMockData = () => {
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
