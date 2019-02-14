import { useConfig } from 'store'
import { clearCache, getRequest, postRequest } from 'utils/request'

/**
 * Fetch request for WordPress admin AJAX.
 */
export const adminAjaxRequest = ( { method = 'GET', ...args } ) => {
	const { ajaxUrl } = useConfig()
	const ajaxArgs = {
		root: ajaxUrl,
		...args,
	}
	return 'GET' === method ? getRequest( ajaxArgs ) : postRequest( ajaxArgs )
}

/**
 * Updates a single plugin.
 */
export const updatePlugin = ( plugin, onSuccess, onError ) => {
	const { updateNonce } = useConfig()
	clearCache( 'updates' )
	return adminAjaxRequest( {
		onSuccess,
		onError,
		method: 'POST',
		args: {
			plugin,
			action: 'update-plugin',
			slug: plugin.split( '/' ).pop(),
			_wpnonce: updateNonce,
		},
	} )
}

/**
 * Updates a single theme.
 */
export const updateTheme = ( theme, onSuccess, onError ) => {
	const { updateNonce } = useConfig()
	clearCache( 'updates' )
	return adminAjaxRequest( {
		onSuccess,
		onError,
		method: 'POST',
		args: {
			action: 'update-theme',
			slug: theme,
			_wpnonce: updateNonce,
		},
	} )
}
