import Promise from 'promise'
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import qs from 'qs'

const { apiRoot, nonce } = FL_ASSISTANT_CONFIG

/**
 * Cache adapter for axios requests.
 *
 * @type {Object}
 */
const cache = setupCache( {
	debug: false,
	maxAge: 15 * 60 * 1000,
	exclude: {
		query: false,
	},
	key: ( req ) => {
		let key = req.url + qs.stringify( req.params, { addQueryPrefix: true } )
		if ( req.cacheKey ) {
			return `fl-cache-${ req.cacheKey }-${ key }`
		}
		return key
	},
	invalidate: ( config, req ) => {
		const method = req.method.toLowerCase()
		if ( req.cacheKey && 'get' !== method ) {
			config.store.iterate( ( data, key ) => {
				if ( key.startsWith( `fl-cache-${ req.cacheKey }` ) ) {
					config.store.removeItem( key )
				}
			} )
		} else if ( req.ignoreCache ) {
			config.store.removeItem( config.uuid )
		}
	},
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
	adapter: cache.adapter,
} )

/**
 * The main interface for making REST requests.
 */
export const getWpRest = () => {
	return {
		posts,
		terms,
		users,
		attachments,
		comments,
		updates,
		search,
		labels,
		notations,
		getPagedContent,
		getContent
	}
}

/**
 * Methods related to posts
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
			config.cacheKey = 'posts'
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
			config.cacheKey = 'posts'
			return http.get( `fl-assistant/v1/posts/${id}`, config )
		},

		/**
		 * Find posts by query
		 * @param params
		 * @param config
		 */
		findWhere( params, config = {} ) {
			config.cacheKey = 'posts'
			config.params = params
			return http.get( 'fl-assistant/v1/posts', config )
		},

		/**
		 * Create a new post
		 * @param data
		 * @param config
		 */
		create( data = {}, config = {} ) {
			config.cacheKey = 'posts'
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
			config.cacheKey = 'posts'
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
			config.cacheKey = 'posts'
			return http.delete( `fl-assistant/v1/posts/${id}`, config )
		},

		/**
		 * Clone a post
		 * @param data
		 * @param config
		 */
		clone( id, config = {} ) {
			config.cacheKey = 'posts'
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
			config.cacheKey = 'users'
			return http.get( `fl-assistant/v1/users/${id}`, config )
		},

		/**
		 * Find WordPress users by query
		 * @param params
		 * @param config
		 */
		findWhere( params, config = {} ) {
			config.cacheKey = 'users'
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
			config.cacheKey = 'terms'
			return http.get( 'fl-assistant/v1/terms/hierarchical', {
				params,
				...config
			} )
		},


		/**
		 * Get parent list of terms by query
		 * @param params
		 * @param config
		 */
		getParentTerms( params, config = {} ) {
			config.cacheKey = 'terms'
			return http.get( 'fl-assistant/v1/terms/get_parent_terms', {
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
			config.cacheKey = 'terms'
			return http.get( `fl-assistant/v1/terms/${id}`, config )
		},

		/**
		 * Create a new Term
		 * @param term
		 * @param config
		 * @returns {Promise<AxiosResponse<T>>}
		 */
		create( term, config = {} ) {
			config.cacheKey = 'terms'
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
			config.cacheKey = 'terms'
			return http.post( `fl-assistant/v1/terms/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to comments
 */
const comments = () => {

	return {

		/**
		 * Find comment by ID
		 * @param id
		 * @returns {Promise<AxiosResponse<T>>}
		 */
		findById( id, config = {} ) {
			config.cacheKey = 'comments'
			return http.get( `fl-assistant/v1/comments/${id}`, config )
		},

		/**
		 * Find comment by query
		 * @param params
		 * @returns {Promise<AxiosResponse<T>>}
		 */
		findWhere( params, config = {} ) {
			config.cacheKey = 'comments'
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
			config.cacheKey = 'comments'
			return http.post( `fl-assistant/v1/comments/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to attachments
 */
const attachments = () => {
	return {

		/**
		 * Returns data for a single attachment.
		 */
		findById( id, config = {} ) {
			config.cacheKey = 'attachments'
			return http.get( `fl-assistant/v1/attachments/${id}`, config )
		},

		/**
		 * Returns an array of attachments.
		 */
		findWhere( params, config = {} ) {
			config.cacheKey = 'attachments'
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
			config.cacheKey = 'attachments'
			return http.post( `fl-assistant/v1/attachments/${id}`, {
				action,
				data,
			}, config )
		}
	}
}

/**
 * Methods related to updates
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
			config.ignoreCache = true
			config.params = params
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
 * @returns {Promise<AxiosResponse<T>>}
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
 * @returns {Promise<AxiosResponse<T>>}
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
 * @param keyword
 * @param routes
 * @param config
 * @returns {Promise<AxiosResponse<T>>}
 */
const search = ( keyword, routes, config = {} ) => {
	config.ignoreCache = true
	return http.get( 'fl-assistant/v1/search', {
		params: {
			keyword,
			routes
		},
		...config
	} )
}

/**
 * Methods related to labels
 */
const labels = () => {
	return {

		findWhere( params, config = {} ) {
			config.cacheKey = 'labels'
			config.params = params
			return http.get( 'fl-assistant/v1/labels', config )
		},
	}
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
