import React, { cloneElement, useContext, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { EmptyMessage, AppContext } from 'components'
import { ContentListContainer, ContentListItem, ContentListItemLoading } from './parts'
import './style.scss'

export const ContentList = ( {
	data = [],
	dataLoader = () => {},
	dataHasMore = false,
	container = <ContentListContainer />,
	containerClass = '',
	item = <ContentListItem />,
	itemClass = '',
	itemThumb = true,
	itemMeta = true,
	itemActions = true,
	placeholderItem = <ContentListItemLoading />,
	placeholderItemCount = 10
} ) => {
	const [ requests ] = useState( [] )
	const appContext = useContext( AppContext )

	const loadItems = () => {
		requests.length && requests.pop().cancel()
		requests.push( dataLoader( data.length ) )
	}

	const getPlaceholderItems = () => {
		const count = data.length ? 1 : placeholderItemCount
		return Array( count ).fill().map( ( item, key ) => {
			return cloneElement( placeholderItem, {
				className: itemClass,
				key,
			} )
		} )
	}

	if ( ! data.length && ! dataHasMore ) {
		return <EmptyMessage>No Results Found</EmptyMessage>
	}

	return (
		<InfiniteScroll
			getScrollParent={ () => appContext.scrollParent.current }
			hasMore={ dataHasMore }
			loadMore={ loadItems }
			loader={ getPlaceholderItems() }
			threshold={ 500 }
			useWindow={ false }
		>
			{ cloneElement( container, {
					className: containerClass
				},
				data.map( ( props, key ) => {
					return cloneElement( item, {
						className: itemClass,
						key,
						itemThumb,
						itemMeta,
						itemActions,
						...props,
					} )
				} )
			) }
		</InfiniteScroll>
	)
}
