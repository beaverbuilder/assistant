import Promise from 'promise'
import axios from 'axios'
import CacheHelper from './cache-helper'

const { apiRoot, nonce } = FL_ASSISTANT_CONFIG

const cacheHelper = new CacheHelper( 'fl-assistant-wp-rest', {

	// Changing this to true will send alot of output to the console
	debug: true,

	// Set cache timeout - 15 minutes
	maxAge: 15 * 60 * 1000,
} )

/**
 * Create `axios` instance with pre-configured `axios-cache-adapter`
 * and some custom cache invalidation magic.
 *
 * @type {AxiosInstance}
 */
const http = axios.create( {
	baseURL: apiRoot,
	headers: {
		common: {
			'X-WP-Nonce': nonce.api
		}
	},
	adapter: cacheHelper.generateCacheAdapter()
} )

export const getWpRest = () => {
	return {
		posts,
		terms,
		users,
		attachments,
		comments,
		updates,
		search,
		notations,
		getPagedContent,
		getContent
	}
}


/**
 * Posts
 * @type {{findWhere(*=): *, findById(*): *, create(*=): *, update(*, *, *=): *}}
 */
const posts = () => {

	return {

		/**
         * Get hierarchical posts by query
         * @param params
         * @param config
         * @returns {Promise<AxiosResponse<T>>}
         */
		hierarchical( params, config = {} ) {
			config.params = params
			return http.get( 'fl-assistant/v1/posts/hierarchical', config )
		},

		/**
         * Find post by ID
         * @param id
         * @param config
         * @returns {Promise<*>}
         */
		findById( id, config = {} ) {
			return http.get( `fl-assistant/v1/posts/${id}`, config )
		},

		/**
         * Find posts by query
         * @param params
         * @param config
         */
		findWhere( params, config = {} ) {
			config.params = params
			return http.get( 'fl-assistant/v1/posts', config )
		},

		/**
         * Create a new post
         * @param data
         * @param config
         */
		create( data = {}, config = {} ) {
			return http.post( 'fl-assistant/v1/posts', data, config )
		},

		/**
         * Update a post
         * @param id
         * @param action
         * @param data
         * @param config
         */
		update( id, action, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/posts/${id}`, {
				action,
				data,
			}, config )
		},

		/**
         * Delete a post
         * @param id
         * @param config
         */
		delete( id, config = {} ) {
			return http.delete( `fl-assistant/v1/posts/${id}`, config )
		},

		/**
         * Clone a post
         * @param data
         * @param config
         */
		clone( id, config = {} ) {
			return http.post( `fl-assistant/v1/posts/${id}/clone`, config )
		},
	}
}

/**
 * Methods related to users
 */
const users = () => {
	return {

		/**
         * Find WordPress user by ID
         * @param id
         * @param config
         */
		findById( id, config = {} ) {
			return http.get( `fl-assistant/v1/users/${id}`, config )
		},

		/**
         * Find WordPress users by query
         * @param params
         * @param config
         */
		findWhere( params, config = {} ) {
			config.params = params
			return http.get( 'fl-assistant/v1/users', config )
		},

		/**
         * Update current WordPress user state.
         * @param state
         * @param config
         */
		updateState( state, config = {} ) {
			return http.post( 'fl-assistant/v1/current-user/state', { state }, config )
		}
	}
}

/**
 * Methods related to terms
 */
const terms = () => {
	return {

		/**
         * Get hierarchical list of terms by query
         * @param params
         * @param config
         */
		hierarchical( params, config = {} ) {
			return http.get( 'fl-assistant/v1/terms/hierarchical', {
				params,
				...config
			} )
		},

		/**
         * Find term by ID
         * @param id
         * @param config
         * @returns {Promise<AxiosResponse<T>>}
         */
		findById( id, config = {} ) {
			return http.get( `fl-assistant/v1/terms/${id}`, config )
		},

		/**
         * Create a new Term
         * @param term
         * @param config
         * @returns {Promise<AxiosResponse<T>>}
         */
		create( term, config = {} ) {
			return http.post( 'fl-assistant/v1/terms', term, config )
		},

		/**
         * Update a term
         * @param id
         * @param action
         * @param data
         * @returns {Promise<AxiosResponse<T>>}
         */
		update( id, action, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/terms/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to comments
 * @type {{findWhere(*=): *, findById(*): *, update(*, *, *=): *}}
 */
const comments = () => {

	return {

		/**
         * Find comment by ID
         * @param id
         * @returns {Promise<AxiosResponse<T>>}
         */
		findById( id, config = {} ) {
			return http.get( `fl-assistant/v1/comments/${id}`, config )
		},

		/**
         * Find comment by query
         * @param params
         * @returns {Promise<AxiosResponse<T>>}
         */
		findWhere( params, config = {} ) {
			config.params = params

			return http.get( 'fl-assistant/v1/comments', config )
		},

		/**
         * Update a comment
         *
         * @param id
         * @param action
         * @param data
         * @returns {Promise<AxiosResponse<T>>}
         */
		update( id, action, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/comments/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to attachments
 * @type {{findWhere(*=): *, findById(*): *, update(*, *, *=): *}}
 */
const attachments = () => {
	return {

		/**
         * Returns data for a single attachment.
         */
		findById( id, config = {} ) {
			return http.get( `fl-assistant/v1/attachments/${id}`, config )
		},

		/**
         * Returns an array of attachments.
         */
		findWhere( params, config = {} ) {
			return http.get( 'fl-assistant/v1/attachments', {
				params,
				...config
			} )
		},

		/**
         * Updates a single attachment. See the update_attachment
         * REST method for a list of supported actions.
         */
		update( id, action, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/attachments/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to updates
 * @returns {Promise<AxiosResponse<T>>|{findWhere(*): *}}
 */
const updates = () => {
	return {

		/**
         * Find updates based on query params
         *
         * @param params
         * @returns {Promise<AxiosResponse<T>>}
         */
		findWhere( params, config = {} ) {
			config.params = params

			// disable cache for updates
			config.cache = { ignoreCache: true }

			return http.get( 'fl-assistant/v1/updates', config )
		}
	}
}

/**
 * Returns any array of content for the given type such as posts or terms.
 *
 * @param type
 * @param params
 * @param config
 * @returns {*|Promise<*>|*|Promise<*>|Promise<*>|*}
 */
const getContent = ( type, params, config = {} ) => {
	switch ( type ) {
	case 'posts':
		return posts().findWhere( params, config )
	case 'terms':
		return terms().findWhere( params, config )
	case 'attachments':
		return attachments().findWhere( params, config )
	case 'comments':
		return comments().findWhere( params, config )
	case 'users':
		return users().findWhere( params, config )
	case 'updates':
		return updates().findWhere( params, config )
	}
}

/**
 * Returns any array of paginated content.
 *
 * @param type
 * @param params
 * @param offset
 * @param config
 */
const getPagedContent = async( type, params, offset = 0, config = {} ) => {
	let paged = Object.assign( { offset }, params )
	let perPage = 20

	switch ( type ) {
	case 'posts':
	case 'attachments':
		paged.posts_per_page = paged.posts_per_page ? paged.posts_per_page : perPage
		perPage = paged.posts_per_page
		break
	default:
		paged.number = paged.number ? paged.number : perPage
		perPage = paged.number
		break
	}

	try {
		return await getContent( type, paged, config )
	} catch ( error ) {
		return Promise.reject( error )
	}
}

/**
 * Search for pages, posts, users, or comments.
 *
 * Note that because search issues a POST request to the API, it will not be cached in the browser.
 *
 * @param keyword
 * @param routes
 * @param config
 * @returns {Promise<AxiosResponse<T>>}
 */
const search = ( keyword, routes, config = {} ) => {
	return http.get( 'fl-assistant/v1/search', {
		params: {
			keyword,
			routes
		},
		...config
	} )
}

/**
 * Methods related to notations
 */
const notations = () => {
	return {

		/**
         * Create a new notation
         */
		create( type, objectType, objectId, meta = {}, config = {} ) {
			return posts().create( {
				post_type: 'fl_asst_notation',
				post_status: 'publish',
				meta_input: {
					fl_asst_notation_type: type,
					fl_asst_notation_object_id: objectId,
					fl_asst_notation_object_type: objectType,
					...meta,
				},
			}, config )
		},

		/**
         * Delete a notation
         */
		delete( type, objectType, objectId, meta = {}, config = {} ) {
			return http.post( 'fl-assistant/v1/notations/delete-where-meta', {
				fl_asst_notation_type: type,
				fl_asst_notation_object_type: objectType,
				fl_asst_notation_object_id: objectId,
				...meta,
			}, config )
		},

		/**
         * Create a new "favorite" notation
         */
		createFavorite( objectType, objectId, userId, config = {} ) {
			return notations().create( 'favorite', objectType, objectId, {
				fl_asst_notation_user_id: userId,
			}, config )
		},

		/**
         * Delete a "favorite" notation
         */
		deleteFavorite( objectType, objectId, userId, config = {} ) {
			return notations().delete( 'favorite', objectType, objectId, {
				fl_asst_notation_user_id: userId,
			}, config )
		},

		/**
         * Create a new "label" notation
         */
		createLabel( objectType, objectId, labelId, config = {} ) {
			return notations().create( 'label', objectType, objectId, {
				fl_asst_notation_label_id: labelId,
			}, config )
		},

		/**
         * Delete a "label" notation
         */
		deleteLabel( objectType, objectId, labelId, config = {} ) {
			return notations().delete( 'label', objectType, objectId, {
				fl_asst_notation_label_id: labelId,
			}, config )
		},
	}
}
