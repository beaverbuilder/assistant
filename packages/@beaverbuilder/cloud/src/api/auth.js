import Promise from 'promise'
import * as session from '../session'

export default ( http ) => {

	const api = {

		/**
		 * Register with Assistant Cloud
		 *
		 * @param email
		 * @param password
		 * @param config
		 * @returns Promise
		 */
		register: ( first_name, last_name, email, password, config = {} ) => {
			const data = {
				first_name,
				last_name,
				email,
				username: email,
				password,
				password_confirmation: password
			}
			return new Promise( ( resolve, reject ) => {
				http.post( '/account/user/register', data, config )
					.then( ( response ) => {
						if ( response.response ) {
							reject( response.response.data )
							return
						}
						resolve()
					} )
					.catch( reject )
			} )
		},

		/**
		 * Login to Assistant Cloud
		 *
		 * @param email
		 * @param password
		 * @param remember
		 * @param config
		 * @returns Promise
		 */
		login: ( email, password, remember, config = {} ) => {
			return new Promise( ( resolve, reject ) => {
				http.post( '/iam/authenticate', { email, password }, config )
					.then( ( response ) => {
						if ( response.response ) {
							reject( response.response.data )
							return
						}
						const { token, user } = response.data
						session.create( token, user, remember )
						resolve( { token, user } )
					} )
					.catch( reject )
			} )
		},

		/**
		 * Logout of Assistant Cloud
		 *
		 * @param config
		 * @returns Promise
		 */
		logout: ( config = {} ) => {
			return new Promise( ( resolve, reject ) => {
				http.post( '/iam/token/destroy', {}, config )
					.then( () => {
						session.destroy()
						resolve()
					} ).catch( reject )
			} )
		},

		/**
		 * Refresh the auth token
		 *
		 * @param config
		 * @returns Promise
		 */
		refresh: ( config = {} ) => {
			return new Promise( ( resolve, reject ) => {
				http.post( '/iam/token/refresh', {}, config )
					.then( ( response ) => {
						if ( ! response.data || ! response.data.token ) {
							session.destroy()
							reject( response )
							return
						}
						const { token } = response.data
						session.setToken( token )
						resolve( response.data )
					} )
					.catch( error => {
						session.destroy()
						reject( error )
					} )
			} )
		},

		/**
		 * Sends the password reset email.
		 *
		 * @returns Promise
		 */

		resetPassword: ( email ) => {
			return new Promise( ( resolve ) => {
				setTimeout( () => {
					resolve()
				}, 1000 )
			} )
		},

		/**
		 * Checks if the session has a token and user.
		 *
		 * @returns bool
		 */
		isConnected: () => {
			return session.hasToken() && session.hasUser()
		}
	}

	return api
}
