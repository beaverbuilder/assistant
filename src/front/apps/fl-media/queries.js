import { getPagedContent } from 'utils/wordpress'

export const mediaQuery = () => {
	return {
		posts_per_page: 20,
		post_type: 'attachment'
	}
}

// Preload
getPagedContent( 'posts', mediaQuery() )
