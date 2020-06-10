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
		 * @param config
		 * @returns Promise
		 */
		login: ( email, password, config = {} ) => {
			return new Promise( ( resolve, reject ) => {
				http.post( '/iam/authenticate', { email, password }, config )
					.then( ( response ) => {
						if ( response.response ) {
							reject( response.response.data )
							return
						}
						const { token, user } = response.data
						session.create( token, user )
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
			return new Promise( ( resolve ) => {
				http.post( '/iam/token/destroy', {}, config )
				session.destroy()
				resolve()
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
						const { plainTextToken } = response.data.token
						session.setToken( plainTextToken )
						resolve()
					} )
					.catch( error => {
						session.destroy()
						reject( error )
					} )
			} )
		},

		/**
		 * Checks to see if the user is still logged in.
		 * If not, the session will be destroyed.
		 *
		 * @returns void
		 */
		checkAccess: async() => {
			if ( api.isConnected() ) {
				try {
					await api.refresh()
				} catch ( error ) {
					console.log( error ) // eslint-disable-line no-console
				}
			}
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
