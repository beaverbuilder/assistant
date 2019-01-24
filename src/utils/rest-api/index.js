import request from 'utils/request'

/**
 * Returns a route with the provided args.
 *
 * @since 0.1
 * @param {String} route
 * @param {Object} args
 * @return {Object}
 */
export function getRoute( route, args = {} ) {
	const keys = Object.keys( args )

	if ( keys.length ) {
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
 * Makes a get request for an endpoint with the
 * provided args added automatically.
 *
 * @since 0.1
 * @param {String} endpoint
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getEndpoint( endpoint, args, complete ) {
	return request( {
		route: getRoute( `fl-assistant/v1/${ endpoint }`, args ),
		complete
	} )
}

/**
 * Returns any array of content for the given type
 * such as posts or terms.
 *
 * @since 0.1
 * @param {String} type
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getContent( type, args, complete ) {
	switch ( type ) {
		case 'posts':
			return getPosts( args, complete )
		case 'terms':
			return getTerms( args, complete )
	}
}

/**
 * Returns any array of posts.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getPosts( args, complete ) {
	return getEndpoint( 'posts', args, complete )
}

/**
 * Returns any array of post terms.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getTerms( args, complete ) {
	return getEndpoint( 'terms', args, complete )
}

/**
 * Returns any array of users.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getUsers( args, complete ) {
	return getEndpoint( 'users', args, complete )
}
