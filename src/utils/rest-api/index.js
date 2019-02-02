import { addQueryArgs, getRequest, postRequest } from 'utils/request'
import store from 'store'

/**
 * Returns any array of content for the given type
 * such as posts or terms.
 *
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
		complete && complete( data, hasMore )
	} )
}

/**
 * Returns any array of posts.
 *
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getPosts = ( args, complete ) => {
	return getRequest( {
		route: addQueryArgs( 'fl-assistant/v1/posts', args ),
		cacheKey: 'posts',
		complete
	} )
}

/**
 * Returns data for a single post.
 *
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getPost = ( id, complete ) => {
	return getRequest( {
		route: `fl-assistant/v1/post/${ id }`,
		cacheKey: 'posts',
		complete
	} )
}

/**
 * Returns any array of post terms.
 *
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getTerms = ( args, complete ) => {
	return getRequest( {
		route: addQueryArgs( 'fl-assistant/v1/terms', args ),
		cacheKey: 'terms',
		complete
	} )
}

/**
 * Returns data for a single term.
 *
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getTerm = ( id, complete ) => {
	return getRequest( {
		route: `fl-assistant/v1/term/${ id }`,
		cacheKey: 'terms',
		complete
	} )
}

/**
 * Returns any array of comments.
 *
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getComments = ( args, complete ) => {
	return getRequest( {
		route: addQueryArgs( 'fl-assistant/v1/comments', args ),
		cacheKey: 'comments',
		complete
	} )
}

/**
 * Returns data for a single comment.
 *
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getComment = ( id, complete ) => {
	return getRequest( {
		route: `fl-assistant/v1/comment/${ id }`,
		cacheKey: 'comments',
		complete
	} )
}

/**
 * Returns any array of users.
 *
 * @param {Object} args
 * @param {Function} complete
 * @return {Object}
 */
export const getUsers = ( args, complete ) => {
	return getRequest( {
		route: addQueryArgs( 'fl-assistant/v1/users', args ),
		cacheKey: 'users',
		complete
	} )
}

/**
 * Returns data for a single user.
 *
 * @param {Number} id
 * @param {Function} complete
 * @return {Object}
 */
export const getUser = ( id, complete ) => {
	return getRequest( {
		route: `fl-assistant/v1/user/${ id }`,
		cacheKey: 'users',
		complete
	} )
}

/**
 * Updates the saved state for the current user.
 *
 * @param {Object} state
 * @return {Object}
 */
export const updateUserState = ( state ) => {
	const { id } = store.getState().currentUser
	return postRequest( {
		route: `fl-assistant/v1/user/${ id }/state`,
		args: {
			state: JSON.stringify( state ),
		}
	} )
}

/**
 * Returns any array of updates.
 *
 * @param {Function} complete
 * @return {Object}
 */
export const getUpdates = ( complete ) => {
	return getRequest( {
		route: 'fl-assistant/v1/updates',
		cacheKey: 'updates',
		complete
	} )
}

/**
 * Updates a single plugin.
 *
 * @param {String} plugin
 * @param {Function} complete
 * @return {Object}
 */
export const updatePlugin = ( plugin, complete ) => {
	const t = new Date().getTime()
	return getRequest( {
		route: addQueryArgs( 'fl-assistant/v1/updates/update-plugin', { plugin, t } ),
		cached: false,
		complete
	} )
}
