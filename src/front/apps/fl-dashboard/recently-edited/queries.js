import { getPagedContent } from 'utils/rest-api'

export const recentQuery = ( type ) => {
	return {
		posts_per_page: 5,
		post_type: type,
	}
}

// Preload
getPagedContent( 'posts', recentQuery( 'any' ), 0 )
getPagedContent( 'posts', recentQuery( 'post' ), 0 )
getPagedContent( 'posts', recentQuery( 'page' ), 0 )
