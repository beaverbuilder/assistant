import request from 'utils/request'

/**
 * Requests a list of posts with the given type.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export function getPosts( args, complete ) {
	let route = `fl-assistant/v1/posts?type=${ args.type }`

	if ( args.search ) {
		route += `&search=${ args.search }`
	}

	return request( { route, complete } )
}
