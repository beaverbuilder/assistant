import { getPagedContent } from 'utils/wordpress'

export const updatesQuery = ( type ) => {
	return { type }
}

// Preload
getPagedContent( 'updates', updatesQuery( 'all' ) )
