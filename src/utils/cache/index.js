import md5 from 'md5'

/**
 * Milliseconds until cache expires.
 */
const CACHE_EXPIRES = 30000

/**
 * Returns a cached response from local storage.
 */
export const getCache = ( type, key ) => {
	const item = localStorage.getItem( `fl-cache-${ type }-${ md5( key ) }` )

	if ( item ) {
		const parsed = JSON.parse( item )
		const now = new Date().getTime()
		if ( ! parsed.expires || parsed.expires > now ) {
			return parsed.data
		}
	}

	return null
}

/**
 * Saves a cached response to local storage.
 */
export const setCache = ( type, key, response, expires = CACHE_EXPIRES ) => {
	const now = new Date().getTime()
	const item = JSON.stringify( {
		expires: expires ? now + expires : false,
		data: response,
	} )

	localStorage.setItem( `fl-cache-${ type }-${ md5( key ) }`, item )
}

/**
 * Clears the cache for the passed type.
 */
export const clearCache = ( type ) => {
	const keys = Object.keys( localStorage )

	keys.map( key => {
		if ( -1 < key.indexOf( `fl-cache-${ type }` ) ) {
			localStorage.removeItem( key )
		}
	} )
}
