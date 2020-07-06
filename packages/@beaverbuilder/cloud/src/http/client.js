import axios from 'axios'
import Promise from 'promise'
import * as session from '../session'
import auth from '../api/auth'

export const createHttpClient = ( {
	apiUrl = ''
} ) => {

	const http = axios.create( {
		baseURL: `${ apiUrl }/api`,
		crossDomain: true,
		headers: {
			common: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Access-Control-Allow-Origin': '*',
			}
		}
	} )

	/**
	 * Request interceptor for setting the authorization
	 * header and content type.
	 */
	http.interceptors.request.use( ( config ) => {
		if ( session.hasToken() ) {
			config.headers.Authorization = 'Bearer ' + session.getToken()
		}
		if ( config.data instanceof FormData ) {
			config.headers.common['Content-Type'] = 'multipart/form-data'
		}
		return config
	}, Promise.reject )

	/**
	 * Response interceptor for attempting to refresh the
	 * current session when there is a 401 error.
	 */
	let queue = []
	let refreshing = false

	http.interceptors.response.use( ( response ) => {
		return response
	}, ( error ) => {
		const { config, response } = error
		if ( 401 !== response.status || config.url.includes( '/iam/' ) ) {
			return Promise.reject( error )
		}
		if ( ! refreshing ) {
			refreshing = true
			auth( http ).refresh().then( () => {
				queue.map( request => {
					request.config.headers['Authorization'] = 'Bearer ' + session.getToken()
					request.resolve( http( request.config ) )
				} )
			} ).finally( () => {
				queue = []
				refreshing = false
			} )
		}
		return new Promise( ( resolve, reject ) => {
			queue.push( { config, resolve, reject } )
		} )
	} )

	return http
}
