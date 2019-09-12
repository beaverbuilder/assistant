/**
 * The cacheing system knows when to invalidate based on "url prefixes".  
 * 
 * All requests generate a cache "prefix" that is inferred from the URL.  
 * If a request is sent with a method other than GET, all keys within that request's prefix are invalidated.
 * 
 * The prefix is inferred via the following format:  
 *  [FL_ASSISTANT_CONFIG.apiRoot/][assistant-rest-namespace/]--PREFIX--[/rest/of.the?url=parts&stuff=things&junk]
 * 
 * Simply put:
 * 
 *  If a request is made to a url like this one: 
 * 
 *  http://yourwpsite.com/wp-json/fl-assistant/v1/posts?offset=0&order=ASC&orderby=title&post_status=any&post_type=page&posts_per_page=20
 * 
 *  The inferred prefix is "posts".
 * 
 *  If a subsequent request is made to create/update/delete/clone a post, all related cache entries are invalidated.
 */
import axios from "axios"
import { setupCache } from 'axios-cache-adapter'
import localforage from 'localforage'
import qs from 'qs'

/**
 * Create the localforage instance.
 * @param {String} storagePrefix This is a prefix for the localforage instance, not the cache key for requests.
 */
const createStorage = (storagePrefix) => {
    return localforage.createInstance({
        // Attempt IndexDB then fall back to LocalStorage
        driver: [
            localforage.LOCALSTORAGE,
        ],
        // Prefix all storage keys to prevent conflicts
        name: storagePrefix
    })
}

/**
 * Iterate keys in the cache, and remove any that start with the supplied prefix.  
 * @param {String} prefix 
 */
const clearCachePrefix = async (prefix, cacheStore) => {
    let keys = await cacheStore.keys();
    keys.forEach((key) => {
        if (key.startsWith(prefix, 0)) {
            cacheStore.removeItem(key);
        }
    })
}

/**
 * Infers the cache prefix from the request url
 * @param {Request} req 
 */
const inferPrefixFromUrl = (req) => {
    let base = FL_ASSISTANT_CONFIG.apiRoot + "fl-assistant/v1/";
    let remainingPath = req.url.replace(base, "");

    let pathTokens = remainingPath.split("/");
    if (pathTokens.length > 0) {
        return pathTokens[0];
    }
    return pathTokens;
}

/**
 * CacheKey callback that should be passed to axios-cache-adapter.
 * Generates a unique cache key for each request by appending request params to the prefix.
 * 
 * @param {Request} req 
 */
const generateCacheKey = (req) => {
    // allow for requests to override the infered cachePrefix.
    if (req.cachePrefix) {
        let cachePrefix = req.cachePrefix
    } else {
        let cachePrefix = inferPrefixFromUrl(req);
    }
    if (req.params) {
        cachePrefix = `${cachePrefix}/${qs.stringify(req.params)}`
    }
    return cachePrefix
}

/**
 * Factory method to create an invalidate callback function with reference to an instance of the created cacheStore
 * 
 * @param {localforage} cacheStore 
 */
const createInvalidateCallback = (cacheStore) => {
    /**
    * Invalidate callback that should be passed to axios-cache-adapter config.
    */
    return async (cfg, req) => {
        const method = req.method.toLowerCase()
        if (method !== 'get') {
            await clearCachePrefix(cfg.uuid, cacheStore);
        }
    }
}

/**
 * Create an instance of axios, with axios-cache-adapter, that knows when to invalidate caches.
 * @param {String} storagePrefix 
 * @param {Object} axiosConfig 
 * @param {Object} cacheConfig 
 */
export const createCachedAxios = (storagePrefix, axiosConfig = {}, cacheConfig = {}) => {

    const cacheStore = createStorage(storagePrefix);
    const invalidateCallback = createInvalidateCallback(cacheStore);

    const cacheConfigDefaults = {
        // Dont exclude cache requests with query params.
        exclude: { query: false },
        store: cacheStore,
        key: generateCacheKey,
        invalidate: invalidateCallback
    }

    return axios.create({
        ...axiosConfig,
        cache: setupCache({
            ...cacheConfigDefaults,
            ...cacheConfig
        })
    })
}

export const createDefaultAxios = axios.create;
