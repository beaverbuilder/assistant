import { request, addQueryArgs } from 'utils/request'
import store from 'store'

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
export const getContent = ( type, args, complete ) => {
	switch ( type ) {
	case 'posts':
		return getPosts( args, complete )
	case 'terms':
		return getTerms( args, complete )
	case 'comments':
		return getComments( args, complete )
	case 'users':
		return getUsers( args, complete )
	case 'updates':
		return getUpdates( complete )
	}
}

/**
 * Returns any array of paginated content.
 *
 * @since 0.1
 * @param {String} type
 * @param {Object} args
 * @param {Number} offset
 * @param {Function} complete
 * @return {Object}
 */
export const getPagedContent = ( type, args, offset, complete ) => {
	let paged = Object.assign( {}, args )
	let perPage = 20

	switch ( type ) {
	case 'posts':
		paged.offset = offset
		paged.posts_per_page = paged.posts_per_page ? paged.posts_per_page : perPage
		perPage = paged.posts_per_page
		break
	case 'terms':
	case 'comments':
	case 'users':
		paged.offset = offset
		paged.number = paged.number ? paged.number : perPage
		perPage = paged.number
		break
	case 'updates':
		break
	}

	return getContent( type, paged, data => {
		const hasMore = data.length && data.length === perPage ? true : false
		complete( data, hasMore )
	} )
}

/**
 * Returns any array of posts.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getPosts = ( args, complete ) => {
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/posts', args ),
		complete
	} )
}

/**
 * Returns data for a single post.
 *
 * @since 0.1
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getPost = ( id, complete ) => {
	return request( {
		route: `fl-assistant/v1/post/${ id }`,
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
export const getTerms = ( args, complete ) => {
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/terms', args ),
		complete
	} )
}

/**
 * Returns data for a single term.
 *
 * @since 0.1
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getTerm = ( id, complete ) => {
	return request( {
		route: `fl-assistant/v1/term/${ id }`,
		complete
	} )
}

/**
 * Returns any array of comments.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getComments = ( args, complete ) => {
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/comments', args ),
		complete
	} )
}

/**
 * Returns data for a single comment.
 *
 * @since 0.1
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getComment = ( id, complete ) => {
	return request( {
		route: `fl-assistant/v1/comment/${ id }`,
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
export const getUsers = ( args, complete ) => {
	return request( {
		route: addQueryArgs( 'fl-assistant/v1/users', args ),
		complete
	} )
}

/**
 * Returns data for a single user.
 *
 * @since 0.1
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getUser = ( id, complete ) => {
	return request( {
		route: `fl-assistant/v1/user/${ id }`,
		complete
	} )
}

/**
 * Updates the saved state for the current user.
 *
 * @since 0.1
 * @param {Object} state
 * @return {Object}
 */
export const updateUserState = ( state ) => {
	const { id } = store.getState().currentUser
	return request( {
		route: `fl-assistant/v1/user/${ id }/state`,
		args: {
			state: JSON.stringify( state ),
		}
	} )
}

/**
 * Returns any array of updates.
 *
 * @since 0.1
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getUpdates = ( complete ) => {
	return request( {
		route: 'fl-assistant/v1/updates',
		complete
	} )
}
