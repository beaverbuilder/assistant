import axios from 'axios'
import Promise from 'promise'
import * as session from '../session'

export const createHttpClient = ( {
	apiUrl = ''
} ) => {

	const http = axios.create( {
		baseURL: `${ apiUrl }`,
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

	http.interceptors.request.use( ( config ) => {
		if ( session.hasToken() ) {
			config.headers.Authorization = 'Bearer ' + session.getToken()
		}
		if ( config.data instanceof FormData ) {
			config.headers.common['Content-Type'] = 'multipart/form-data'
		}
		return config
	}, Promise.reject )

	return http
}
