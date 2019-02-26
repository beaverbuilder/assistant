import { getSystemConfig } from 'store'
import { clearCache } from 'utils/cache'
import { getRequest, postRequest } from 'utils/request'

/**
 * Fetch request for WordPress admin AJAX.
 */
export const adminAjaxRequest = ( { method = 'GET', ...args } ) => {
	const { ajaxUrl } = getSystemConfig()
	const ajaxArgs = {
		root: ajaxUrl,
		...args,
	}
	return 'GET' === method ? getRequest( ajaxArgs ) : postRequest( ajaxArgs )
}

/**
 * Reply to a comment.
 */
export const replyToComment = ( id, postId, content, onSuccess, onError ) => {
	const { nonce } = getSystemConfig()
	clearCache( 'comments' )
	return adminAjaxRequest( {
		method: 'POST',
		onSuccess: response => {
			if ( response.includes( '<wp_ajax>' ) ) {
				onSuccess( response )
			} else {
				onError( response )
			}
		},
		args: {
			action: 'replyto-comment',
			_wpnonce: nonce.reply,
			_wp_unfiltered_html_comment: nonce.replyUnfiltered,
			approve_parent: 1,
			comment_ID: id,
			comment_post_ID: postId,
			content,
		},
	} )
}

/**
 * Updates a single plugin.
 */
export const updatePlugin = ( plugin, onSuccess, onError ) => {
	const { nonce } = getSystemConfig()
	clearCache( 'updates' )
	return adminAjaxRequest( {
		onSuccess,
		onError,
		method: 'POST',
		args: {
			plugin,
			action: 'update-plugin',
			slug: plugin.split( '/' ).pop(),
			_wpnonce: nonce.updates,
		},
	} )
}

/**
 * Updates a single theme.
 */
export const updateTheme = ( theme, onSuccess, onError ) => {
	const { nonce } = getSystemConfig()
	clearCache( 'updates' )
	return adminAjaxRequest( {
		onSuccess,
		onError,
		method: 'POST',
		args: {
			action: 'update-theme',
			slug: theme,
			_wpnonce: nonce.updates,
		},
	} )
}
