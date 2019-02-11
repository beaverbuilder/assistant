import { getPagedContent } from 'utils/wordpress'

export const commentsQuery = () => {
	return {}
}

// Preload
getPagedContent( 'comments', commentsQuery() )
