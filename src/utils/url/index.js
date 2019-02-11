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

/**
 * Adds a leading slash to a route.
 *
 * @param {String}
 * @return {Object}
 */
export const addLeadingSlash = ( route ) => {
	return 0 === route.indexOf( '/' ) ? route : `/${ route }`
}
