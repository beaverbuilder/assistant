/**
 * Truncate text to the specified length while
 * respecting punctuation.
 */
export function truncate( string = '', length = 40, ellipses = '...' ) {
	const part = string.substring( 0, length )
	const last = part[ part.length - 1 ]
	const punctuation = [ '.', '!', '?' ]

	if ( string.length <= length || punctuation.includes( last ) ) {
		return part
	}
	if ( ! last.match( /[a-zA-Z]/ ) ) {
		return part.substring( 0, part.length - 1 ) + ellipses
	}

	return part + ellipses
}
