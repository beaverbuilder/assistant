import { getPagedContent } from 'utils/rest-api'

export const mediaQuery = () => {
	return {
		posts_per_page: 20,
		post_type: 'attachment'
	}
}

// Preload
getPagedContent( 'posts', mediaQuery(), 0 )
