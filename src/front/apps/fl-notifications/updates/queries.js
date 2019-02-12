import { getPagedContent } from 'utils/wordpress'

export const updatesQuery = () => {
	return {}
}

// Preload
getPagedContent( 'updates', updatesQuery() )
