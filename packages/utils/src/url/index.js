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

/**
 * Checks if string is an absolute url
 * @param url
 * @returns {*|boolean}
 */
export const isAbsoluteURL = (url) => {
	// A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	// RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	// by any combination of letters, digits, plus, period, or hyphen.
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
