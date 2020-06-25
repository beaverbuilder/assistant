import { createHttpClient } from './http'
import { createWebSocketsClient } from './sockets'
import * as session from './session'
import endpoints from './api'

export const createCloudClient = ( {
	apiUrl = '',
	pusherKey = '',
	pusherCluster = ''
} ) => {
	const http = createHttpClient( {
		apiUrl
	} )

	const sockets = createWebSocketsClient( {
		apiUrl,
		pusherKey,
		pusherCluster
	} )

	const client = {
		http,
		sockets,
		session
	}

	for ( let key in endpoints ) {
		client[ key ] = endpoints[ key ]( http, sockets )
	}

	return client
}
