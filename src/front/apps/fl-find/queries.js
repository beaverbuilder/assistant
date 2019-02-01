import { getPagedContent } from 'utils/rest-api'

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
getPagedContent( 'posts', postQuery( 'post', 'publish' ), 0 )
getPagedContent( 'posts', postQuery( 'page', 'publish' ), 0 )
getPagedContent( 'terms', termQuery( 'category' ), 0 )
getPagedContent( 'terms', termQuery( 'post_tag' ), 0 )
