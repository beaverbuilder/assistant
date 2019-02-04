import { getPagedContent } from 'utils/rest-api'

export const commentsQuery = () => {
	return {}
}

// Preload
getPagedContent( 'comments', commentsQuery() )
