import { setupCache } from 'axios-cache-adapter'
import localforage from 'localforage'
import qs from 'qs'

/**
 * The cacheing system knows when to invalidate based on "url prefixes".
 *
 * All requests generate a cache "prefix" that is inferred from the URL.
 * If a request is sent with a method other than GET, all keys within that request's prefix are invalidated.
 *
 * The prefix is inferred via the following format:
 *
 *      [FL_ASSISTANT_CONFIG.apiRoot/][assistant-rest-namespace/]--PREFIX--[/rest/of.the?url=parts&stuff=things&junk]
 *
 *  Basically, if a request is made to a url like this one:
 *
 *      http://yourwpsite.com/wp-json/fl-assistant/v1/posts?offset=0&post_type=page&posts_per_page=20
 *
 *  The inferred prefix is "posts".
 *
 *  If a subsequent request is made to create/update/delete/clone a post, all related cache entries are invalidated.
 */
class CacheHelper {

	constructor( storagePrefix, cacheConfig = {} ) {

		let defaults = {
			debug: false,


			// Dont exclude cache requests with query params.
			exclude: { query: false }
		}

		this.cacheConfig = {
			...defaults,
			...cacheConfig
		}

		this.log = this.log.bind( this )
		this.clearCachePrefix = this.clearCachePrefix.bind( this )
		this.inferPrefixFromUrl = this.inferPrefixFromUrl.bind( this )
		this.generateCacheKey = this.generateCacheKey.bind( this )
		this.shouldInvalidate = this.shouldInvalidate.bind( this )


		this.cacheStore = localforage.createInstance( {
			driver: [
				localforage.LOCALSTORAGE,
			],

			// Prefix all storage keys to prevent conflicts
			name: storagePrefix
		} )
	}

	log( ...args ) {
		if ( this.cacheConfig.debug ) {

			console.log( '%c[assistant][cache-helper]', 'color: orange;font-weight:bold;', ...args ) // eslint-disable-line no-console
		}
	}

	/**
	 * Infers the cache prefix from the request url
	 * @param {Request} req
	 */
	inferPrefixFromUrl( req ) {

		let base = FL_ASSISTANT_CONFIG.apiRoot + 'fl-assistant/v1/'
		let remainingPath = req.url.replace( base, '' )

		let pathTokens = remainingPath.split( '/' )
		if ( 0 < pathTokens.length ) {
			return pathTokens[0]
		}
		return pathTokens
	}

	/**
	 * Iterate keys in the cache, and remove any that start with the supplied prefix.
	 * @param {String} prefix
	 */
	async clearCachePrefix( prefix ) {
		let keys = await this.cacheStore.keys()
		keys.forEach( async( key ) => {
			this.log( 'Checking key', key )
			if ( key.startsWith( prefix, 0 ) ) {
				this.log( 'invalidating cache for prefix', prefix )
				await this.cacheStore.removeItem( key )
			}
		} )
	}

	/**
	 * Creates cache key callback that should be passed to axios-cache-adapter.
	 */
	generateCacheKey( req ) {

		// allow for requests to override the infered cachePrefix.
		let cachePrefix = this.inferPrefixFromUrl( req )

		if ( req.cachePrefix ) {
			cachePrefix = req.cachePrefix
		}

		if ( req.params ) {
			cachePrefix = `${cachePrefix}/${qs.stringify( req.params )}`
		}

		this.log( 'Generated cache prefix', cachePrefix )

		return cachePrefix
	}

	/**
	 * Factory method to create an invalidate callback function with reference to an instance of the created cacheStore
	 *
	 */
	async shouldInvalidate( cfg, req ) {
		const method = req.method.toLowerCase()
		if ( 'get' !== method ) {

			this.log( 'attempting to clear cache prefix', cfg.uuid )

			await this.clearCachePrefix( cfg.uuid )
		}

	}

	generateCacheAdapter() {
		this.cacheConfig.store = this.cacheStore
		this.cacheConfig.key = this.generateCacheKey
		this.cacheConfig.invalidate = this.shouldInvalidate

		let cache = setupCache( this.cacheConfig )
		return cache.adapter
	}
}


export default CacheHelper
