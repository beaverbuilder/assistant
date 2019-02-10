import { getPagedContent } from 'utils/wordpress/rest'

export const commentsQuery = () => {
	return {}
}

// Preload
getPagedContent( 'comments', commentsQuery() )
