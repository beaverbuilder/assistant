import axios from 'axios'
import Promise from 'promise'
import * as session from '../auth/session'

const { cloudUrl } = FL_ASSISTANT_CONFIG

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

http.interceptors.request.use( ( config ) => {
	if ( session.hasToken() ) {
		config.headers.Authorization = 'Bearer ' + session.getToken()
	}
	return config
}, Promise.reject )

export default http
