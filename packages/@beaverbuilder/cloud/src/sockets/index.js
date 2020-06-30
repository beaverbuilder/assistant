import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import * as session from '../session'

export const createWebSocketsClient = ( {
	apiUrl = '',
	pusherKey = '',
	pusherCluster = ''
} ) => {

	const client = new Echo( {
		broadcaster: 'pusher',
		key: pusherKey,
		cluster: pusherCluster,
		forceTLS: false,
		authEndpoint: `${ apiUrl }/broadcasting/auth`,
		auth: {
			headers: {
				Authorization: `Bearer ${ session.getToken() }`
			},
		},
	} )

	return client
}
