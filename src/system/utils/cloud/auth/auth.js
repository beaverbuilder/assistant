import Promise from 'promise'
import * as session from './session'
import http from '../http'

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
				session.create( token, user )
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
					session.destroy()
					reject( response )
					return
				}

				// Handle success
				const { plainTextToken } = response.data.token
				session.setToken( plainTextToken )
				resolve()
			} )
			.catch( error => {
				session.destroy()
				reject( error )
			} )
	} )
}

/**
 * Checks to see if the user is still logged in.
 * If not, the session will be destroyed.
 * @returns void
 */
export const checkAccess = async() => {
	if ( isConnected() ) {
		try {
			await refresh()
		} catch ( error ) {}
	}
}

/**
 * Clear the token locally and on server
 * @param config
 * @returns Promise
 */
export const logout = ( config = {} ) => {

	return new Promise( ( resolve ) => {
		http.post( '/iam/token/destroy', {}, config )
		session.destroy()
		resolve()
	} )
}

/**
 * Session has token and user.
 * @returns bool
 */
export const isConnected = () => {
	return session.hasToken() && session.hasUser()
}
