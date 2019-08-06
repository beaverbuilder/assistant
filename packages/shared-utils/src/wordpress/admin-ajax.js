import { getSystemConfig } from 'store'
import { clearCache } from 'shared-utils/cache'
import { getWpAjax } from "shared-utils/http";

const wpAjax = getWpAjax();

/**
 * Fetch request for WordPress admin AJAX.
 */
export const adminAjaxRequest = ( { method = 'GET', ...args } ) => {

	const ajaxArgs = {
		...args,
	}

	if('GET' === method.toUpperCase()) {
		wpAjax.getAction(ajaxArgs.data.action, ajaxArgs.data)
			.then(args.onSuccess)
			.catch(args.onError);
	} else {
		wpAjax.postAction(ajaxArgs.data.action, ajaxArgs.data)
			.then(args.onSuccess)
			.catch(args.onError);
	}
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
		data: {
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
		data: {
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
		data: {
			action: 'update-theme',
			slug: theme,
			_wpnonce: nonce.updates,
		},
	} )
}
