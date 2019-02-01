import md5 from 'md5'
import store from 'store'

/**
 * Milliseconds until cache expires.
 *
 * @type {Number}
 */
const CACHE_EXPIRES = 180000

/**
 * GET requests that are currently running.
 *
 * Used to prevent two of the same request firing at the
 * same time. When one is already running, the others will
 * resolve when that has finished.
 *
 * @type {Array}
 */
const requests = []

/**
 * Makes a GET request with caching.
 *
 * @param {Object}
 * @return {Object}
 */
export const getRequest = ( { route, complete = Function } ) => {
	const promise = getCachedRequest( route, complete )

	if ( promise.cached ) {
		return promise
	}

	if ( ! requests[ route ] ) {
		requests[ route ] = []
		request( {
			route,
			method: 'GET',
			complete: data => {
				setCache( route, data )
				requests[ route ].map( promise =>
					! promise.cancelled && promise.resolve( data )
				)
				requests[ route ] = null
			},
		} )
	}

	requests[ route ].push( promise )

	return promise
}

/**
 * Returns a promise that resolves if cached.
 *
 * @param {String}
 * @param {Function}
 * @return {Object|Boolean}
 */
export const getCachedRequest = ( route, complete = Function ) => {
	const cache = getCache( route )
	const promise = {
		cancel: () => promise.cancelled = true,
		resolve: data => complete( data ),
	}

	if ( cache ) {
		promise.cached = true
		promise.resolve( cache )
	}

	return promise
}

/**
 * Makes a POST request.
 *
 * @param {Object}
 * @return {Object}
 */
export const postRequest = ( { route, args = {}, complete = Function } ) => {
	const body = new FormData()

	Object.entries( args ).map( ( [ key, value ] ) => {
		body.append( key, value )
	} )

	const promise = request( {
		method: 'POST',
		route,
		body,
		complete,
	} )

	return promise
}

/**
 * Fetch with cancel.
 *
 * @param {Object}
 * @return {Object}
 */
export const request = ( { method, route, body, complete = Function } ) => {
	const { apiNonce, apiRoot } = store.getState()

	const promise = fetch( apiRoot + route, {
		body,
		method,
		credentials: 'same-origin',
		headers: {
			'X-WP-Nonce': apiNonce,
		},
	} ).then( response => {
		return response.json()
	} ).then( json => {
		if ( ! promise.cancelled ) {
			complete( json )
		}
	} )

	promise.cancel = () => promise.cancelled = true

	return promise
}

/**
 * Returns a cached response from local storage.
 *
 * @param {String} route
 * @return {Object}
 */
export const getCache = ( route ) => {
	const item = localStorage.getItem( `fl-assistant-${ md5( route ) }` )

	if ( item ) {
		const parsed = JSON.parse( item )
		const now = new Date().getTime()
		if ( now - parsed.expires < CACHE_EXPIRES ) {
			return parsed.data
		}
	}

	return null
}

/**
 * Saves a cached response to local storage.
 *
 * @param {String} route
 */
export const setCache = ( route, response ) => {
	const item = JSON.stringify( {
		expires: new Date().getTime(),
		data: response,
	} )

	localStorage.setItem( `fl-assistant-${ md5( route ) }`, item )
}

/**
 * Adds query args to a route.
 *
 * @param {String} route
 * @param {Object} args
 * @return {Object}
 */
export const addQueryArgs = ( route, args ) => {
	if ( ! args ) {
		return route
	}

	const keys = Object.keys( args )

	if ( keys.length && -1 === route.indexOf( '?' ) ) {
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
