import { clearCache, getCache, setCache } from './cache'

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
	root,
	route,
	credentials,
	headers,
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
			root,
			route,
			credentials,
			headers,
			method: 'GET',
			onSuccess: data => {
				cached && setCache( cacheKey, route, data )
				requests[ route ].map( result =>
					! result.cancelled && result.onSuccess( data )
				)
				requests[ route ] = null
			},
			onError: error => {
				clearCache( cacheKey )
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
	root,
	route,
	credentials,
	headers,
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
		root,
		route,
		credentials,
		headers,
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
	root = '',
	route = '',
	body,
	credentials,
	headers = {},
	onSuccess = () => {},
	onError = () => {},
} ) => {
	const promise = fetch( root + route, {
		method,
		body,
		credentials,
		headers,
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
