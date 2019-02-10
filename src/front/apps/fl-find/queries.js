import { getPagedContent } from 'utils/wordpress/rest'

export const postQuery = ( type, status ) => {
	return {
		post_type: type,
		posts_per_page: 20,
		orderby: 'title',
		order: 'ASC',
		s: '',
		post_status: 'attachment' === type ? 'any' : status,
	}
}

export const termQuery = ( type ) => {
	return {
		taxonomy: type,
		hide_empty: 0
	}
}

// Preload
getPagedContent( 'posts', postQuery( 'post', 'publish' ) )
getPagedContent( 'posts', postQuery( 'page', 'publish' ) )
getPagedContent( 'terms', termQuery( 'category' ) )
getPagedContent( 'terms', termQuery( 'post_tag' ) )
