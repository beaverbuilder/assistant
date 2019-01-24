import { request, addQueryArgs } from 'utils/request'

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
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/posts', args ),
		complete
	} )
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
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/terms', args ),
		complete
	} )
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
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/users', args ),
		complete
	} )
}
