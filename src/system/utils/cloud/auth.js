import axios from 'axios'
import Promise from 'promise'
import * as session from './session'
import { getCloudActions } from 'data/cloud'

const { cloudUrl } = FL_ASSISTANT_CONFIG

const freshCancelToken = () => {
	return axios.CancelToken.source()
}

const currentRequest = {
	active: false,
	source: freshCancelToken()
}

/**
 * Create new axios instance
 * @type {AxiosInstance}
 */
const http = axios.create( {
	baseURL: cloudUrl,
	crossDomain: true,
	headers: {
		common: {
			Accept: 'application/json',
			'Content-type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
			'Access-Control-Allow-Origin': '*',
		}
	}
} )

/**
 * Attach the token to every request, if it exists
 */
http.interceptors.request.use( ( config ) => {

	// mark request as active
	currentRequest.active = true

	// attach the token to request
	if ( session.hasToken() ) {
		config.headers.Authorization = 'Bearer ' + session.getToken()
	}
	return config
}, Promise.reject )


http.interceptors.response.use( ( config ) => {
	currentRequest.active = false
	return config
}, ( error ) => {
	currentRequest.active = false
	return error
} )

/**
 * Is there an active request?
 * @returns {boolean}
 */
export const isActive = () => {
	return currentRequest.active
}

/**
 * Cancel any running requests
 * @param message
 */
export const cancel = ( message ) => {
	currentRequest.source.cancel( message )
	currentRequest.source = freshCancelToken()
}

/**
 * Refresh the users token once per minute
 * @type {number}
 */
// TODO: Disabled for now. Causing logout.
// const interval = setInterval( async() => {
// 	if ( session.hasToken() ) {
// 		try {
// 			await refresh()
// 		} catch ( error ) {
// 			clearInterval( interval )
// 			session.removeToken()
// 			session.removeUser()
// 		}
// 	}
// }, 60000 )

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

		// Mockup...
		const data = {
			token: '80NpnYAYbruhB80vt4XQq0RfwQZFkMAAqBDBhg48EBWwW6KIixXtWamXuPlHSK1SNtpydk4XdauTPJtR',
			user: {
				created_at: '2020-04-18T00:28:53.000000Z',
				current_team_id: 1,
				deleted_at: null,
				email: 'test@test.com',
				email_verified_at: null,
				first_name: 'Mr.',
				id: 1,
				last_name: 'Robot',
				name: 'Mr. Robot',
				updated_at: '2020-04-18T00:28:53.000000Z',
				username: 'test@test.com'
			}
		}

		const { token, user } = data
		const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
		session.setToken( token )
		session.setUser( user )
		setCloudToken( token )
		setCloudUser( user )
		setIsCloudConnected( true )
		resolve( data )
		return

		http.post( '/iam/authenticate', { email, password }, config )
			.then( ( response ) => {

				// Handle an error
				if ( response.response ) {
					reject( response.response.data )
					return
				}

				// Handle success
				const { token, user } = response.data.data
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
				if ( response.response ) {
					reject( response.response.data )
					return
				}

				// Handle success
				const { token, user } = response.data.data
				session.setToken( token )
				session.setUser( user )
				resolve( { token, user } )
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

	return new Promise( ( resolve, reject ) => {
		http.post( '/iam/token/destroy', {}, config )
			.then( () => {
				const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
				session.removeToken()
				session.removeUser()
				setCloudToken( {} )
				setCloudUser( null )
				setIsCloudConnected( false )
				resolve()
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
			resolve()
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
