/**
 * Adds query args to a route.
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
 */
export const addLeadingSlash = ( route ) => {
	return 0 === route.indexOf( '/' ) ? route : `/${ route }`
}

/**
 * Creates a URL safe slug with only letters, numbers, and dashes.
 */
export const createSlug = ( string ) => {
	return string.toLowerCase().replace( /\s/g, '-' ).replace( /[^a-z0-9-]+/g, '' )
}
