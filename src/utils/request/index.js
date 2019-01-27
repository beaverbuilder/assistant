import store from 'store'

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
 * @param {Object}
 * @return {Object}
 */
export const request = ( { route, args, complete } ) => {
	const { apiNonce, apiRoot } = store.getState()
	const method = args ? 'POST' : 'GET'
	let body = null
	let promise = null

	if ( 'GET' === method && cache[ route ] ) {
		if ( complete ) {
			complete( cache[ route ] )
		}
	} else {

		if ( args ) {
			body = new FormData()
			Object.entries( args ).map( ( [ key, value ], index ) => {
				body.append( key, value )
			} )
		}

		promise = fetch( apiRoot + route, {
			body,
			method,
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': apiNonce,
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

/**
 * Adds query args to a route.
 *
 * @since 0.1
 * @param {String} route
 * @param {Object} args
 * @return {Object}
 */
export const addQueryArgs = ( route, args ) => {
	if ( ! args ) {
		return route
	}

	const keys = Object.keys( args )

	if ( keys.length && route.indexOf( '?' ) === -1 ) {
		route += '?'
	}

	keys.map( ( key, index ) => {
		route += `${ key }=${ encodeURIComponent( args[ key ] ) }`
		if ( index < keys.length - 1 ) {
			route += '&'
		}
	} )

	return route
}
