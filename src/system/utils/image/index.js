
/**
 * Get a srcset string from an object of sizes.
 * Expects size.url and size.width to be present.
 */
export const getSrcSet = ( sizes = {} ) => {
	return Object.values( sizes ).map( size => {
		return size.url + ' ' + size.width + 'w'
	} ).join( ', ' )
}
