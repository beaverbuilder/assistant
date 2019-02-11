import { getPagedContent } from 'utils/wordpress'

export const recentQuery = ( type ) => {
	return {
		posts_per_page: 5,
		post_type: type,
	}
}

// Preload
getPagedContent( 'posts', recentQuery( 'any' ) )
getPagedContent( 'posts', recentQuery( 'post' ) )
getPagedContent( 'posts', recentQuery( 'page' ) )
