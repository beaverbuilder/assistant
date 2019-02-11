import md5 from 'md5'

/**
 * Milliseconds until cache expires.
 *
 * @type {Number}
 */
const CACHE_EXPIRES = 30000

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
