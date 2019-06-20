/**
 * Test if a string is a valid URL
 */
export const isURL = string => {
	const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
	return regexp.test( string )
}

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
