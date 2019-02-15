import { getPagedContent } from 'utils/wordpress'

export const attachmentQuery = ( type ) => {
	return {
		posts_per_page: 20,
		post_type: 'attachment',
		post_mime_type: type,
	}
}

// Preload
getPagedContent( 'posts', attachmentQuery( 'image' ) )
