import { createHttpClient } from './http'
import { createWebSocketsClient } from './sockets'
import * as session from './session'
import endpoints from './api'
import admin from './admin'

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
		session,
		admin: {},
	}

	for ( let key in endpoints ) {
		client[ key ] = endpoints[ key ]( http, sockets )
	}

	for ( let key in admin ) {
		client.admin[ key ] = admin[ key ]( http, sockets )
	}

	return client
}
