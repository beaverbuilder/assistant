import Promise from 'promise'
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import qs from 'qs'


const { apiRoot, nonce, adminURLs } = FL_ASSISTANT_CONFIG

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
		paths: [ 'fl-assistant/v1/current-user/state' ]
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
			clearWpRestCache( req.cacheKey )
		} else if ( req.ignoreCache ) {
			config.store.removeItem( config.uuid )
		}
	},
} )

/**
 * Clears the cache for a given key.
 *
 * @param cacheKey
 */
export const clearWpRestCache = cacheKey => {
	cache.store.iterate( ( data, key ) => {
		if ( key.startsWith( `fl-cache-${ cacheKey }` ) ) {
			cache.store.removeItem( key )
		}
	} )
}

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
		batch,
		posts,
		terms,
		users,
		attachments,
		comments,
		updates,
		search,
		notations,
		libraries,
		getPagedContent,
		getContent,
		http
	}
}

/**
 * Methods for making batch REST requests.
 */
const batch = () => {
	return {
		get( routes ) {
			const params = {
				routes: Object.keys( routes )
			}
			http.get( 'fl-assistant/v1/batch', { params } ).then( response => {
				Object.keys( response.data ).map( route => {
					routes[ route ]( response.data[ route ] )
				} )
			} )
		},
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

		/**
		 * Export a post
		 * @param data
		 * @param config
		 */
		export( id, config = {} ) {
			config.cacheKey = 'posts'
			return http.post( `fl-assistant/v1/posts/${id}/export`, config )
		},

		/**
		 * Delete Temporary exported file
		 * @param data
		 * @param config
		 */
		deleteExport( id, config = {} ) {
			config.cacheKey = 'posts'
			return http.delete( `fl-assistant/v1/posts/${id}/export`, config )
		},

		/**
		 * Adds a label to a post.
		 */
		addLabel( postId, labelId, config = {} ) {
			clearWpRestCache( 'posts' )
			return notations().createLabel( 'post', postId, labelId, config )
		},

		/**
		 * Removes a label from a post.
		 */
		removeLabel( postId, labelId, config = {} ) {
			clearWpRestCache( 'posts' )
			return notations().deleteLabel( 'post', postId, labelId, config )
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
		},

		/**
		 * Upload media
		 * @param data
		 * @param config
		 */
		create( file, config = {} ) {
			config.cacheKey = 'attachments'
			return http.post( 'wp/v2/media/', file, config )
		},

		/**
		 * Adds a label to an attachment.
		 */
		addLabel( attachmentId, labelId, config = {} ) {
			clearWpRestCache( 'attachments' )
			return notations().createLabel( 'attachment', attachmentId, labelId, config )
		},

		/**
		 * Removes a label from an attachment.
		 */
		removeLabel( attachmentId, labelId, config = {} ) {
			clearWpRestCache( 'attachments' )
			return notations().deleteLabel( 'attachment', attachmentId, labelId, config )
		},
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

/**
 * Methods for making library REST requests.
 */
const libraries = () => {
	return {

		/**
		 * Import library item into WP
		 */
		importItem( item ) {
			const type = item.type.replaceAll( '_', '-' )
			return http.post( `fl-assistant/v1/library-items/import/${ type }`, { item } )
		},

		/**
		 * Export WP post data into library
		 */
		exportPost( id, libraryId, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/posts/${id}/library/${libraryId}`, data, config )
		},

		/**
		 * Import library post item into WP
		 */
		importPost( itemId, config = {} ) {
			config.cacheKey = 'posts'
			return http.post( `fl-assistant/v1/posts/import_from_library/${itemId}`, {}, config )
		},

		/**
		 * Override WP post data with library post item data
		 */
		syncPost( id, itemId, config = {} ) {
			config.cacheKey = 'posts'
			return http.post( `fl-assistant/v1/posts/${id}/sync_from_library/${itemId}`, {}, config )
		},

		/**
		 * Preview a library post item
		 */
		previewPost( itemId, config = {} ) {
			return http.post( `fl-assistant/v1/posts/preview_library_post/${itemId}`, {}, config )
		},

		/**
		 * Export WP post data into library
		 */
		exportImage( id, libraryId, data = {}, config = {} ) {
			return http.post( `fl-assistant/v1/images/${id}/library/${libraryId}`, data, config )
		},

		/**
		 * Export WP Customizer settings into library
		 */
		exportThemeSettings( libraryId, data = {}, config = {} ) {
			const http = axios.create( {
				headers: {
					common: {
						'X-WP-Nonce': nonce.api
					}
				}
			} )

			const body = new FormData()
			body.append( 'fl_assistant_export', libraryId )
			Object.entries( data ).map( ( [ key, value ] ) => body.append( key, value ) )

			return http.post( adminURLs.customizeBase, body, config )
		},

		/**
		 * Export WP Customizer settings into library
		 */
		importThemeSettings( itemId, config = {} ) {
			const http = axios.create( {
				headers: {
					common: {
						'X-WP-Nonce': nonce.api
					}
				}
			} )

			const body = new FormData()
			body.append( 'fl_assistant_import', itemId )

			return http.post( adminURLs.customizeBase, body, config )
		},
	}
}
