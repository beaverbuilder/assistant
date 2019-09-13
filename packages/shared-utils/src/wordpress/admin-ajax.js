import axios from 'axios'
import qs from 'qs'
const {ajaxUrl, nonce} = FL_ASSISTANT_CONFIG

const http = axios.create({
    headers: {
        common: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
});

export const postAction = (action, data = {}, config = {}) => {
    data.action = action;
    return http.post(ajaxUrl, qs.stringify(data), config);
}

export const getAction = (action, queryParams = {}, config = {}) => {
    queryParams.action = action
    return http.get(ajaxUrl, qs.stringify(queryParams), config);
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
