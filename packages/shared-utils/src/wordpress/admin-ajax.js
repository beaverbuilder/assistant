import localforage from 'localforage'
import {setup} from 'axios-cache-adapter'

const {ajaxUrl, nonce} = FL_ASSISTANT_CONFIG

/**
 * Create `axios` instance
 * with pre-configured `axios-cache-adapter`
 * using a `localforage` store
 *
 * @type {AxiosInstance}
 */
const http = setup({
    cache: {
        // Changing this to true will send alot of output to the console
        debug: true,
        // Set cache timeout
        maxAge: 5 * 60 * 1000,
        // DO NOT exclude cache requests with query params.
        exclude: {query: false},
        // Setup localForage store.
        store: localforage.createInstance({
            // Attempt IndexDB then fall back to LocalStorage
            driver: [
                localforage.INDEXEDDB,
                localforage.LOCALSTORAGE,
            ],
            // Prefix all storage keys to prevent conflicts
            name: 'fl-assistant-cache-ajax'
        })
    },
});

export const postAction = (action, data = {}, config = {}) => {
    data.action = action;
    return http.post(ajaxUrl, data, config);
}

export const getAction = (action, queryParams = {}, config = {}) => {
    queryParams.action = action
    return http.get(ajaxUrl, queryParams, config);
}


export const replyToComment = (id, postId, content, config = {}) => {
    return postAction('replyto-comment', {
        _wpnonce: nonce.reply,
        _wp_unfiltered_html_comment: nonce.replyUnfiltered,
        approve_parent: 1,
        comment_ID: id,
        comment_post_ID: postId,
        content,
    }, config)
}


export const updatePlugin = (plugin, config = {}) => {
    return postAction('update-plugin', {
        plugin,
        slug: plugin.split('/').pop(),
        _wpnonce: nonce.updates,
    }, config)
}

export const updateTheme = (theme, config = {}) => {
    return postAction('update-theme', {
        slug: theme,
        _wpnonce: nonce.updates
    }, config)
}
