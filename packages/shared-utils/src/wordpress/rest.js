import {clearCache} from 'shared-utils/cache'
import {addQueryArgs} from 'shared-utils/url'

import {getWpRest} from "../http";

const wpRest = getWpRest();
/**
 * Fetch request for the WordPress REST API.
 */
export const restRequest = ({method = 'GET', ...args}) => {

    const {route, data = {}, onSuccess, onError} = args;

    if ('GET' === method) {
        wpRest.get(route)
            .then(response => onSuccess(response.data))
            .catch(onError)
    } else {
        wpRest.post(route, data)
            .then(response => onSuccess(response.data))
            .catch(onError);
    }
}

/**
 * Returns any array of content for the given type
 * such as posts or terms.
 */
export const getContent = (type, query, onSuccess, onError) => {
    switch (type) {
        case 'posts':
            return getPosts(query, onSuccess, onError)
        case 'terms':
            return getTerms(query, onSuccess, onError)
        case 'attachments':
            return getAttachments(query, onSuccess, onError)
        case 'comments':
            return getComments(query, onSuccess, onError)
        case 'users':
            return getUsers(query, onSuccess, onError)
        case 'updates':
            return getUpdates(query, onSuccess, onError)
    }
}

/**
 * Returns any array of paginated content.
 */
export const getPagedContent = (type, query, offset = 0, onSuccess, onError) => {
    let paged = Object.assign({offset}, query)
    let perPage = 20

    switch (type) {
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

    return getContent(type, paged, data => {
        const hasMore = data.length && data.length === perPage ? true : false
        onSuccess && onSuccess(data, hasMore)
    }, onError)
}

/**
 * Returns any array of posts.
 */
export const getPosts = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/posts', query),
        cacheKey: 'posts',
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of hierarchical posts
 * with child post data contained within the
 * parent post's data object.
 */
export const getHierarchicalPosts = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/posts/hierarchical', query),
        cacheKey: 'posts',
        onSuccess,
        onError,
    })
}

/**
 * Returns data for a single post.
 */
export const getPost = (id, onSuccess, onError) => {
    return restRequest({
        route: `fl-assistant/v1/post/${id}`,
        cacheKey: 'posts',
        onSuccess,
        onError,
    })
}

/**
 * Creates a single post.
 */
export const createPost = (data = {}, onSuccess, onError) => {
    clearCache('posts')
    return restRequest({
        method: 'POST',
        route: 'fl-assistant/v1/post',
        data,
        onSuccess,
        onError,
    })
}

/**
 * Updates a single post. See the update_post
 * REST method for a list of supported actions.
 */
export const updatePost = (id, action, data = {}, onSuccess, onError) => {
    clearCache('posts')
    return restRequest({
        method: 'POST',
        route: `fl-assistant/v1/post/${id}`,
        data: {
            action,
            data,
        },
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of post terms.
 */
export const getTerms = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/terms', query),
        cacheKey: 'terms',
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of hierarchical post terms
 * with child term data contained within the
 * parent term's data object.
 */
export const getHierarchicalTerms = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/terms/hierarchical', query),
        cacheKey: 'terms',
        onSuccess,
        onError,
    })
}

/**
 * Returns data for a single term.
 */
export const getTerm = (id, onSuccess, onError) => {
    return restRequest({
        route: `fl-assistant/v1/term/${id}`,
        cacheKey: 'terms',
        onSuccess,
        onError,
    })
}

/**
 * Creates a single term.
 */
export const createTerm = (data = {}, onSuccess, onError) => {
    clearCache('terms')
    return restRequest({
        method: 'POST',
        route: 'fl-assistant/v1/term',
        data,
        onSuccess,
        onError,
    })
}

/**
 * Updates a single term. See the update_term
 * REST method for a list of supported actions.
 */
export const updateTerm = (id, action, data = {}, onSuccess, onError) => {
    clearCache('terms')
    return restRequest({
        method: 'POST',
        route: `fl-assistant/v1/term/${id}`,
        data: {
            action,
            data,
        },
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of attachments.
 */
export const getAttachments = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/attachments', query),
        cacheKey: 'attachments',
        onSuccess,
        onError,
    })
}

/**
 * Returns data for a single attachment.
 */
export const getAttachment = (id, onSuccess, onError) => {
    return restRequest({
        route: `fl-assistant/v1/attachment/${id}`,
        cacheKey: 'attachments',
        onSuccess,
        onError,
    })
}

/**
 * Updates a single attachment. See the update_attachment
 * REST method for a list of supported actions.
 */
export const updateAttachment = (id, action, data = {}, onSuccess, onError) => {
    clearCache('attachments')
    return restRequest({
        method: 'POST',
        route: `fl-assistant/v1/attachment/${id}`,
        data: {
            action,
            data,
        },
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of comments.
 */
export const getComments = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/comments', query),
        cacheKey: 'comments',
        onSuccess,
        onError,
    })
}

/**
 * Returns data for a single comment.
 */
export const getComment = (id, onSuccess, onError) => {
    return restRequest({
        route: `fl-assistant/v1/comment/${id}`,
        cacheKey: 'comments',
        onSuccess,
        onError,
    })
}

/**
 * Updates a single comment. See the update_comment
 * REST method for a list of supported actions.
 */
export const updateComment = (id, action, data = {}, onSuccess, onError) => {
    clearCache('comments')
    return restRequest({
        method: 'POST',
        route: `fl-assistant/v1/comment/${id}`,
        data: {
            action,
            ...data,
        },
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of users.
 */
export const getUsers = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/users', query),
        cacheKey: 'users',
        onSuccess,
        onError,
    })
}

/**
 * Returns data for a single user.
 */
export const getUser = (id, onSuccess, onError) => {
    return restRequest({
        route: `fl-assistant/v1/user/${id}`,
        cacheKey: 'users',
        onSuccess,
        onError,
    })
}

/**
 * Updates the saved state for the current user.
 */
export const updateUserState = (state, onSuccess, onError) => {
    return restRequest({
        method: 'POST',
        route: 'fl-assistant/v1/current-user/state',
        data: {
            state,
        },
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of updates.
 */
export const getUpdates = (query, onSuccess, onError) => {
    return restRequest({
        route: addQueryArgs('fl-assistant/v1/updates', query),
        cacheKey: 'updates',
        onSuccess,
        onError,
    })
}

/**
 * Returns any array of search results for the
 * given REST routes.
 */
export const getSearchResults = (keyword, routes, onSuccess, onError) => {
    return restRequest({
        method: 'POST',
        route: 'fl-assistant/v1/search',
        data: {
            keyword,
            routes,
        },
        onSuccess,
        onError,
    })
}
