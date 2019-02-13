import store from 'store'
import { postRequest } from 'utils/request'

export const adminAjaxRequest = ( { method = 'GET', ...args } ) => {
	const { ajaxUrl } = store.getState()
	const ajaxArgs = {
		root: ajaxUrl,
		...args,
	}
	return 'GET' === method ? getRequest( ajaxArgs ) : postRequest( ajaxArgs )
}
