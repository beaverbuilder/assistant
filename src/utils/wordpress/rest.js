import { useConfig } from 'store'
import { clearCache, getRequest, postRequest } from 'utils/request'
import { addQueryArgs } from 'utils/url'

/**
 * Fetch request for the WordPress REST API.
 */
export const restRequest = ( { method = 'GET', ...args } ) => {
	const { apiNonce, apiRoot } = useConfig()
	const wpArgs = {
		root: apiRoot,
		credentials: 'same-origin',
		headers: {
			'X-WP-Nonce': apiNonce,
		},
		...args,
	}
	return 'GET' === method ? getRequest( wpArgs ) : postRequest( wpArgs )
}

/**
 * Returns any array of content for the given type
 * such as posts or terms.
 *
 * @param {String}
 * @param {Object}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getContent = ( type, query, onSuccess, onError ) => {
	switch ( type ) {
	case 'posts':
		return getPosts( query, onSuccess, onError )
	case 'terms':
		return getTerms( query, onSuccess, onError )
	case 'comments':
		return getComments( query, onSuccess, onError )
	case 'users':
		return getUsers( query, onSuccess, onError )
	case 'updates':
		return getUpdates( query, onSuccess, onError )
	}
}

/**
 * Returns any array of paginated content.
 *
 * @param {String}
 * @param {Object}
 * @param {Number}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getPagedContent = ( type, query, offset = 0, onSuccess, onError ) => {
	let paged = Object.assign( { offset }, query )
	let perPage = 20

	switch ( type ) {
	case 'posts':
		paged.posts_per_page = paged.posts_per_page ? paged.posts_per_page : perPage
		perPage = paged.posts_per_page
		break
	default:
		paged.number = paged.number ? paged.number : perPage
		perPage = paged.number
		break
	}

	return getContent( type, paged, data => {
		const hasMore = data.length && data.length === perPage ? true : false
		onSuccess && onSuccess( data, hasMore )
	}, onError )
}

/**
 * Returns any array of posts.
 *
 * @param {Object}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getPosts = ( query, onSuccess, onError ) => {
	return restRequest( {
		route: addQueryArgs( 'fl-assistant/v1/posts', query ),
		cacheKey: 'posts',
		onSuccess,
		onError,
	} )
}

/**
 * Returns data for a single post.
 *
 * @param {Number}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getPost = ( id, onSuccess, onError ) => {
	return restRequest( {
		route: `fl-assistant/v1/post/${ id }`,
		cacheKey: 'posts',
		onSuccess,
		onError,
	} )
}

/**
 * Returns any array of post terms.
 *
 * @param {Object}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getTerms = ( query, onSuccess, onError ) => {
	return restRequest( {
		route: addQueryArgs( 'fl-assistant/v1/terms', query ),
		cacheKey: 'terms',
		onSuccess,
		onError,
	} )
}

/**
 * Returns data for a single term.
 *
 * @param {Number}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getTerm = ( id, onSuccess, onError ) => {
	return restRequest( {
		route: `fl-assistant/v1/term/${ id }`,
		cacheKey: 'terms',
		onSuccess,
		onError,
	} )
}

/**
 * Returns any array of comments.
 *
 * @param {Object}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getComments = ( query, onSuccess, onError ) => {
	return restRequest( {
		route: addQueryArgs( 'fl-assistant/v1/comments', query ),
		cacheKey: 'comments',
		onSuccess,
		onError,
	} )
}

/**
 * Returns data for a single comment.
 *
 * @param {Number}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getComment = ( id, onSuccess, onError ) => {
	return restRequest( {
		route: `fl-assistant/v1/comment/${ id }`,
		cacheKey: 'comments',
		onSuccess,
		onError,
	} )
}

/**
 * Updates a single comment. See the update_comment
 * REST method for a list of supported actions.
 *
 * @param {Object}
 * @return {Object}
 */
export const updateComment = ( id, action ) => {
	clearCache( 'comments' )
	return restRequest( {
		method: 'POST',
		route: `fl-assistant/v1/comment/${ id }`,
		args: {
			action,
		}
	} )
}

/**
 * Returns any array of users.
 *
 * @param {Object}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getUsers = ( query, onSuccess, onError ) => {
	return restRequest( {
		route: addQueryArgs( 'fl-assistant/v1/users', query ),
		cacheKey: 'users',
		onSuccess,
		onError,
	} )
}

/**
 * Returns data for a single user.
 *
 * @param {Number}
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getUser = ( id, onSuccess, onError ) => {
	return restRequest( {
		route: `fl-assistant/v1/user/${ id }`,
		cacheKey: 'users',
		onSuccess,
		onError,
	} )
}

/**
 * Updates the saved state for the current user.
 *
 * @param {Object}
 * @return {Object}
 */
export const updateUserState = ( state ) => {
	return restRequest( {
		method: 'POST',
		route: 'fl-assistant/v1/current-user/state',
		args: {
			state: JSON.stringify( state ),
		}
	} )
}

/**
 * Returns any array of updates.
 *
 * @param {Function}
 * @param {Function}
 * @return {Object}
 */
export const getUpdates = ( query, onSuccess, onError ) => {
	return restRequest( {
		route: addQueryArgs( 'fl-assistant/v1/updates', query ),
		cacheKey: 'updates',
		onSuccess,
		onError,
	} )
}
