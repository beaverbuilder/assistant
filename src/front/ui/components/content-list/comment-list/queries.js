import { getPagedContent } from 'utils/wordpress'

export const commentsQuery = ( status ) => {
	return {
		status,
	}
}

// Preload
getPagedContent( 'comments', commentsQuery( 'all' ) )
