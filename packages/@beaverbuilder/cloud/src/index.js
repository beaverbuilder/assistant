import { createHttpClient } from './http'
import * as session from './session'
import endpoints from './api'

export const createCloudClient = ( {
	apiUrl = ''
} ) => {
	const http = createHttpClient( { apiUrl } )
	const api = {}

	for ( let key in endpoints ) {
		api[ key ] = endpoints[ key ]( http )
	}

	return {
		...api,
		http,
		session
	}
}
