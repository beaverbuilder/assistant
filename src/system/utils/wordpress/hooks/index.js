import { useState, useEffect } from 'react'
import { getWpRest } from '../rest'
import { CancelToken, isCancel } from 'axios'

const defaultQuery = {
	posts_per_page: 36
}

export const useAttachments = ( _query = {} ) => {
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()
	const query = { ...defaultQuery, ..._query }
	const [ items, setItems ] = useState( [] )
	const [ isFetching, setIsFetching ] = useState( false )
	const [ hasMore, setHasMore ] = useState( false )

	const loadItems = ( offset = 0 ) => {
		setIsFetching( true )

		return getPagedContent( 'attachments', query, offset, {
			cancelToken: source.token,
		} ).then( response => {
			const { items: newItems, has_more } = response.data
			setItems( [ ...items, ...newItems ] )
			setHasMore( has_more )
			setIsFetching( false )

		} ).catch( error => {
			if ( ! isCancel( error ) ) {
				console.error( error ) // eslint-disable-line no-console
			}
			setIsFetching( false )
		} )
	}

	// Initial Load
	useEffect( () => {
		loadItems( items.length )
		return source.cancel
	}, [] )

	return {
		items,
		loadItems,
		isFetching,
		hasMore,
	}
}
