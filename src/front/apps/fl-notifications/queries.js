import { getPagedContent } from 'utils/rest-api'

export const notificationQuery = () => {
	return {}
}

// Preload
getPagedContent( 'comments', notificationQuery(), 0 )

//getPagedContent( 'updates', notificationQuery(), 0 )
