import isEqual from 'lodash.isequal'

const shouldUpdate = ( needsRender, a, b ) => {

	// Handle bool
	if ( 'boolean' === typeof needsRender ) return needsRender

	// Handle Function
	if ( 'function' === typeof needsRender ) return needsRender( a, b )

	// Handle String as property key
	if ( 'string' === typeof needsRender ) {
		return ! isEqual( a[needsRender], b[needsRender] )
	}

	// Handle as Array of properties
	if ( Array.isArray( needsRender ) ) {
		return needsRender.some( key => ! isEqual( a[key], b[key] ) )
	}

	return false
}

export default shouldUpdate
