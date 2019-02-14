import { getPagedContent } from 'utils/wordpress'

export const mediaQuery = ( /* type */ ) => {

	// TODO: Handle type argument.
	return {
		posts_per_page: 20,
		post_type: 'attachment'
	}
}

// Preload
getPagedContent( 'posts', mediaQuery() )
