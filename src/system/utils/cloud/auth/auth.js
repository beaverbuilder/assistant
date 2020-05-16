import Promise from 'promise'
import * as session from './session'
import { getCloudActions } from 'data/cloud'
import http from '../http'

/**
 * Refresh the users token once per minute
 * @type {number}
 */
const interval = setInterval( async() => {
	if ( session.hasToken() ) {
		try {
			await refresh()
		} catch ( error ) {
			clearInterval( interval )
			session.removeToken()
			session.removeUser()
		}
	}
}, 60000 )

/**
 * Register with Assistant Cloud
 *
 * @param email
 * @param password
 * @param config
 * @returns Promise
 */
export const register = ( first_name, last_name, email, password, config = {} ) => {

	const data = {
		first_name,
		last_name,
		email,
		username: email,
		password,
		password_confirmation: password
	}

	// Wrap axios promise in our own promise
	return new Promise( ( resolve, reject ) => {

		http.post( '/account/user/register', data, config )
			.then( ( response ) => {

				// Handle an error
				if ( response.response ) {
					reject( response.response.data )
					return
				}

				// Handle success
				resolve()
			} )
			.catch( reject )

	} )

}

/**
 * Login to Assistant Cloud
 *
 * @param email
 * @param password
 * @param config
 * @returns Promise
 */
export const login = ( email, password, config = {} ) => {

	// Wrap axios promise in our own promise
	return new Promise( ( resolve, reject ) => {

		http.post( '/iam/authenticate', { email, password }, config )
			.then( ( response ) => {

				// Handle an error
				if ( response.response ) {
					reject( response.response.data )
					return
				}

				// Handle success
				const { token, user } = response.data
				const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
				session.setToken( token )
				session.setUser( user )
				setCloudToken( token )
				setCloudUser( user )
				setIsCloudConnected( true )
				resolve( { token, user } )
			} )
			.catch( reject )
	} )
}

/**
 * Refresh token
 * @param config
 * @returns Promise
 */
export const refresh = ( config = {} ) => {

	// Wrap axios promise in our own promise
	return new Promise( ( resolve, reject ) => {

		// attempt to refresh the token
		http.post( '/iam/token/refresh', {}, config )
			.then( ( response ) => {

				// Handle an error
				if ( ! response.data || ! response.data.token ) {
					reject( response )
					return
				}

				// Handle success
				const { plainTextToken } = response.data.token
				session.setToken( plainTextToken )
				resolve()
			} )
			.catch( reject )
	} )

}

/**
 * Clear the token locally and on server
 * @param config
 * @returns Promise
 */
export const logout = ( config = {} ) => {

	return new Promise( ( resolve ) => {
		const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
		setCloudToken( {} )
		setCloudUser( null )
		setIsCloudConnected( false )
		http.post( '/iam/token/destroy', {}, config )
			.then( () => {
				resolve()
			} )
			.finally( () => {
				session.removeToken()
				session.removeUser()
			} )
	} )
}

/**
 * Sends the password reset email.
 * @param config
 * @returns Promise
 */
export const requestPasswordReset = ( email, config = {} ) => {
	return new Promise( ( resolve ) => {
		setTimeout( () => {
			resolve( config )
		}, 1000 )
	} )
}

/**
 * Session has token and user.
 * @returns bool
 */
export const isConnected = () => {
	return session.hasToken() && session.hasUser()
}
