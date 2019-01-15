/**
 * Cached response data for GET requests.
 *
 * @since 0.1
 * @type {Object}
 */
const cache = {}

/**
 * Cancellable fetch request with caching.
 *
 * @since 0.1
 * @param {Object} args
 * @return {Object}
 */
export default function request( args ) {
	const { route, data, complete } = args
	const { api } = FLAssistantInitialData
	const method = data ? 'POST' : 'GET'
	let body = null
	let promise = null

	if ( 'GET' === method && cache[ route ] ) {
		if ( complete ) {
			complete( cache[ route ] )
		}
	} else {

		if ( data ) {
			body = new FormData()
			Object.entries( data ).map( ( [ key, value ], index ) => {
				body.append( key, value )
			} )
		}

		promise = fetch( api.root + route, {
			body,
			method,
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': api.nonce,
			},
		} ).then( response => {
			return response.json()
		} ).then( json => {
			if ( 'GET' === method ) {
				cache[ route ] = json
			}
			if ( ! promise.cancelled && complete ) {
				complete( json )
			}
		} )
	}

	return {
		cancel: () => {
			if ( promise ) {
				promise.cancelled = true
			}
		}
	}
}
