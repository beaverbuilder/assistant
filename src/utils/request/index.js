import md5 from 'md5'
import store from 'store'

/**
 * Milliseconds until cache expires.
 *
 * @since 0.1
 * @type {Number}
 */
const CACHE_EXPIRES = 180000

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
	const cache = getCache( route )
	let body = null
	let promise = null

	if ( 'GET' === method && cache ) {
		if ( complete ) {
			complete( cache )
		}
	} else {

		if ( args ) {
			body = new FormData()
			Object.entries( args ).map( ( [ key, value ] ) => {
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
				setCache( route, json )
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
 * Returns a cached response from local storage.
 *
 * @since 0.1
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
 * @since 0.1
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
