import { getPagedContent } from 'utils/wordpress/rest'

export const updatesQuery = () => {
	return {}
}

// Preload
getPagedContent( 'updates', updatesQuery() )
