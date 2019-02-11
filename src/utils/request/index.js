import md5 from 'md5'
import store from 'store'

/**
 * Milliseconds until cache expires.
 *
 * @type {Number}
 */
const CACHE_EXPIRES = 30000

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
export const getRequest = ( {
	route,
	cached = true,
	cacheKey = 'cache',
	onSuccess = () => {},
	onError = () => {},
} ) => {
	const result = getCachedRequest( cacheKey, route, onSuccess, onError )

	if ( cached && result.cached ) {
		return result
	}

	if ( ! requests[ route ] ) {
		requests[ route ] = []
		request( {
			route,
			method: 'GET',
			onSuccess: data => {
				cached && setCache( cacheKey, route, data )
				requests[ route ].map( result =>
					! result.cancelled && result.onSuccess( data )
				)
				requests[ route ] = null
			},
			onError: error => {
				requests[ route ].map( result =>
					! result.cancelled && result.onError( error )
				)
				requests[ route ] = null
			}
		} )
	}

	requests[ route ].push( result )

	return result
}

/**
 * Returns a promise that resolves if cached.
 *
 * @param {String}
 * @param {String}
 * @param {Function}
 * @param {Function}
 * @return {Object|Boolean}
 */
export const getCachedRequest = ( key, route, onSuccess, onError ) => {
	const cache = getCache( key, route )
	const result = {
		cached: !! cache,
		cancelled: false,
		cancel: () => result.cancelled = true,
		onSuccess,
		onError,
	}

	if ( cache ) {
		onSuccess( cache )
	}

	return result
}

/**
 * Makes a POST request.
 *
 * @param {Object}
 * @return {Object}
 */
export const postRequest = ( {
	route,
	args = {},
	onSuccess = () => {},
	onError = () => {},
} ) => {
	const body = new FormData()

	Object.entries( args ).map( ( [ key, value ] ) => {
		body.append( key, value )
	} )

	return request( {
		method: 'POST',
		route,
		body,
		onSuccess,
		onError,
	} )
}

/**
 * Fetch with cancel.
 *
 * @param {Object}
 * @return {Object}
 */
export const request = ( {
	method,
	route,
	body,
	onSuccess = () => {},
	onError = () => {},
} ) => {
	const { apiNonce, apiRoot } = store.getState()

	const promise = fetch( apiRoot + route, {
		body,
		method,
		credentials: 'same-origin',
		headers: {
			'X-WP-Nonce': apiNonce,
		},
	} ).then( response => {
		if ( ! response.ok ) {
			throw Error( response.statusText )
		}
		return response.json()
	} ).then( json => {
		if ( ! promise.cancelled ) {
			onSuccess( json )
		}
	} ).catch( error => {
		if ( ! promise.cancelled ) {
			onError( error )
		}
	} )

	return {
		cancel: () => promise.cancelled = true
	}
}

/**
 * Returns a cached response from local storage.
 *
 * @param {String}
 * @param {String}
 * @return {Object}
 */
export const getCache = ( key, route ) => {
	const item = localStorage.getItem( `fl-request-${ key }-${ md5( route ) }` )

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
 * @param {String}
 * @param {String}
 * @param {Function|Null}
 */
export const setCache = ( key, route, response ) => {
	const item = JSON.stringify( {
		expires: new Date().getTime(),
		data: response,
		route,
	} )

	localStorage.setItem( `fl-request-${ key }-${ md5( route ) }`, item )
}

/**
 * Clears the cache for the passed type.
 *
 * @param {String}
 */
export const clearCache = ( type = 'cache' ) => {
	const keys = Object.keys( localStorage )

	keys.map( key => {
		if ( -1 < key.indexOf( `fl-request-${ type }` ) ) {
			localStorage.removeItem( key )
		}
	} )
}

/**
 * Adds query args to a route.
 *
 * @param {String}
 * @param {Object}
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
