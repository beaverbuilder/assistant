import { getPagedContent } from 'utils/rest-api'

export const updatesQuery = () => {
	return {}
}

// Preload
getPagedContent( 'updates', updatesQuery() )
