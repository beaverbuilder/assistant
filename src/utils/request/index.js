import { clearCache, getCache, setCache } from 'utils/cache'

/**
 * GET requests that are currently running.
 *
 * Used to prevent two of the same request firing at the
 * same time. When one is already running, the others will
 * resolve when that has finished.
 */
const requests = []

/**
 * Makes a GET request with caching.
 */
export const getRequest = ( {
	root,
	route,
	credentials,
	headers,
	cached = true,
	cacheKey = 'request',
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
 */
export const postRequest = ( {
	root,
	route,
	credentials,
	headers,
	data = {},
	onSuccess = () => {},
	onError = () => {},
} ) => {
	let body = data

	if ( ! ( data instanceof FormData ) ) {
		body = new FormData()
		Object.entries( data ).map( ( [ key, value ] ) => {
			body.append( key, 'object' === typeof value ? JSON.stringify( value ) : value )
		} )
	}

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
		const type = response.headers.get( 'content-type' )
		if ( ! response.ok ) {
			throw Error( response.statusText )
		} else if ( type.includes( 'text/xml' ) ) {
			return response.text()
		} else if ( type.includes( 'text/html' ) ) {
			return response.text()
		}
		return response.json()
	} ).then( data => {
		if ( ! promise.cancelled ) {
			onSuccess( data )
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
